import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { AuthGuard } from '../../src/app/core/services/auth.guard';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
describe('AuthGuard', () => {
  let guard: AuthGuard;
  const mockMsalService = {
    instance : {
      getActiveAccount : jest.fn()
    }
  };
  const router = {
    navigate : jest.fn()
  };
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
  };
  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };
    TestBed.configureTestingModule({
      providers : [
        {
          provide: MsalService,
          useValue: mockMsalService
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide : EssUploadFileService,
          useValue : service
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate should return false and call router with ["search"] if account exists and url is /' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue({name: 'test123'});
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/'
    } as RouterStateSnapshot)).toEqual(false);
    expect(routerNavigation).toHaveBeenCalledWith(['search']);
  });

  it('canActivate should return true if account exists and url is /search' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue({name: 'test123'});
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/search'
    } as RouterStateSnapshot)).toEqual(true);
  });

  it('canActivate should return true if account exists and url is /enc-list' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue({name: 'test123'});
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/exchangesets/enc-list'
    } as RouterStateSnapshot)).toEqual(true);
  });
  it('canActivate should return false if account exists and enc list is null and url is /enc-list' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue({name: 'test123'});
    const routerNavigation = jest.spyOn(router,'navigate');
    service.getValidEncs.mockReturnValue([]);
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/exchangesets/enc-list'
    } as RouterStateSnapshot)).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['exchangesets']);
  });
  it('canActivate should return false and call router.navigation with [""] if account is null and url is /search' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue(null);
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/search'
    } as RouterStateSnapshot)).toEqual(false);
    expect(routerNavigation).toHaveBeenCalledWith(['']);
  });

  it('canActivate should return true if account is null and url is /' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue(null);
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : '/'
    } as RouterStateSnapshot)).toEqual(true);
  });

  it('canActivate should return false if account is null and url is ""' , () => {
    mockMsalService.instance.getActiveAccount.mockReturnValue(null);
    const routerNavigation = jest.spyOn(router,'navigate');
    expect(guard.canActivate(new ActivatedRouteSnapshot(), {
      url : ''
    } as RouterStateSnapshot)).toEqual(false);
  });
});
