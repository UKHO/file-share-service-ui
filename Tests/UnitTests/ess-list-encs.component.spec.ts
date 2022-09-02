import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule,TextinputModule} from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { CommonModule } from '@angular/common';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';
import { ExchangeSetApiService } from '../../src/app/core/services/exchange-set-api.service';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let msalService: MsalService;
  let exchangeSetApiService: ExchangeSetApiService;
  let fixture: ComponentFixture<EssListEncsComponent>;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn().mockReturnValue([]),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
    getNotifySingleEnc : jest.fn().mockReturnValue(of(true)),
    addAllSelectedEncs : jest.fn(),
    getEstimatedTotalSize:jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule, CheckboxModule,TextinputModule],
      declarations: [ EssListEncsComponent,
        EssAddSingleEncsComponent ], 
      providers: [
        {
          provide : EssUploadFileService,
          useValue : service
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide : MsalService,
          useValue : service
        },
        {
          provide : ExchangeSetApiService,
          useValue : service
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };
    window.scrollTo = jest.fn();
    fixture = TestBed.createComponent(EssListEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set info message if displayErrorMessage is set to true on ngOnInit' ,() => {
    component.ngOnInit();
    expect(component.displayErrorMessage).toBeTruthy();
    expect(component.encList.length).toEqual(5);
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('Some values have not been added to list.');
  });
  it('handleChange should call service.removeSelectedEncs if enc is already present' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210130');
    expect(service.removeSelectedEncs).toHaveBeenCalled();
  });
  it('handleChange should call service.addSelectedEnc if enc is not present' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210180');
    expect(service.addSelectedEnc).toHaveBeenCalled();
  });
  it('handleChange should not call service.addSelectedEnc if selected enc"s are greater than MaxEncSelectionLimit' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    expect(service.addSelectedEnc).not.toHaveBeenCalled();
  });
  it('syncEncsBetweenTables should set encList and selectedEncList' ,() => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(3);
    expect(component.encList.length).toBe(5);
    service.getSelectedENCs.mockReturnValue(['AU210130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(1);
    expect(component.encList.length).toBe(5);
  });
  
  test('should show the error message when user select encs more than selection limit', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    const dialog = fixture.debugElement.nativeElement.querySelector('ukho-dialogue');
    expect(dialog).not.toBeNull();
  });

  it('should create EssListEncsComponent', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should render text inside an h1 tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Exchange sets');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      `Select up to 5 ENCs and make an exchange set`
    );
  });

  test('getValidEncs should return enc', () => {
    const encList = service.getValidEncs();
    expect(encList.length).toEqual(5);
  });
  it('should display Select All text when enc list is less than or equal to configurable enc limit' ,() => {
    component.ngOnInit();
    expect(component.encList.length).toBeLessThanOrEqual(5);
    expect(component.selectDeselectText).toEqual('Select all');
  });

  test('showListEncTOtal class applied to a selector', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('showListEncTOtal'))).toBeTruthy();
  });
  test('bottomText class applied to a tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('bottomText'))).toBeTruthy();
  });

  it.each`
  estimatedSize              | expectedResult
  ${'0KB'}                       |  ${'0KB'}
  ${'1.5MB'}                     |  ${'1.5MB'}
  `('getEstimatedTotalSize called from syncEncsBetweenTables and should return string',
  ({  estimatedSize, expectedResult }: {  estimatedSize: string; expectedResult: string }) => {
    jest.clearAllMocks();
    service.getEstimatedTotalSize.mockReturnValue(estimatedSize);
    component.syncEncsBetweenTables();
    expect(service.getEstimatedTotalSize).toHaveBeenCalled();
    expect(component.getEstimatedTotalSize()).toBe(expectedResult);
    expect(component.estimatedTotalSize).not.toBeNull();
    expect(component.estimatedTotalSize).toBe(expectedResult);
  });

    it('should display Deselect All button when select all button is clicked' ,() => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.selectDeselectAll();
    expect(component.selectDeselectText).toEqual('Deselect all');
  });

  it('should display Select All button when Deselect all button is clicked' ,() => {
    service.getSelectedENCs.mockReturnValue([]);
    component.selectDeselectAll();
    expect(component.selectDeselectText).toEqual('Select all');
  });

  it('should hide select all button if enc list greater than max enc limit' ,() => {
    service.getValidEncs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128', 'AU314140']);
    component.ngOnInit();
    expect(component.showSelectDeselect).toBeFalsy();
  });

  it('should show select all button if enc list less than or equal to max enc limit' ,() => {
    service.getValidEncs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.ngOnInit();
    expect(component.showSelectDeselect).toBeTruthy();
  });

  it('handleChange should set correct error message and call scrollTo is called when maxEncSelectionLimit limit is exceeded' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128','CU314128']);
    component.handleChange('DU314128');
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('No more than 5 ENCs can be selected.');
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('selectDeselectAll should call "service.addAllSelectedEncs" if selectDeselectText=Select all enc length is greater than maxEncSelectionLimit' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128','CU314128']);
    component.selectDeselectText = 'Select all';
    component.selectDeselectAll();
    expect(service.addAllSelectedEncs).toHaveBeenCalled();
  });

  it('selectDeselectAll should call "service.clearSelectedEncs" if selectDeselectText=Deselect all' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']);
    component.selectDeselectText = 'deselect all';
    component.selectDeselectAll();
    expect(service.clearSelectedEncs).toHaveBeenCalled();
  });

  it('getSelectDeselectText should return correct texts(Select all / Deselect all)' , () => {
    component.checkMaxEncSelectionAndSelectedEncLength = jest.fn().mockReturnValue(true);
    expect(component.getSelectDeselectText()).toEqual('Deselect all');
    component.checkMaxEncSelectionAndSelectedEncLength = jest.fn().mockReturnValue(false);
    expect(component.getSelectDeselectText()).toEqual('Select all');
  });
});
