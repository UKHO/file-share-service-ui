import { MsalService } from '@azure/msal-angular';
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
import { ExchangeSetApiService } from '../../src/app/core/services/exchange-set-api.service';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let fixture: ComponentFixture<EssListEncsComponent>;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
    getNotifySingleEnc : jest.fn().mockReturnValue(of(true)),
    exchangeSetCreationResponse: jest.fn().mockReturnValue(of(exchangeSetDetailsMockData))
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
          provide: ExchangeSetApiService,
          useValue: service
        },
        {
          provide: MsalService,
          useValue: service
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    AppConfigService.settings = {
      fssConfig: {
        apiScope: "https://MGIAIDTESTB2C.onmicrosoft.com/ExchangeSetService/Request"
      },
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };
    fixture = TestBed.createComponent(EssListEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    jest.clearAllMocks();
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
    let encList = service.getValidEncs();
    expect(encList.length).toEqual(5);
  });

  test('should return exchangeSet details data', () => {
    component.ngOnInit();
    let selectedEncList = ["AU210130","AU220130","AU314128","AU412129","AU415128","AU424150","AU426113","AU432115","AU439146","AU5BTB01","AU5DAM02","AU5MEL01","AU5PTL01","AU5SYD01","AU6BTB01","BR221070","BR321200","BR401507","BR441012"];
    service.exchangeSetCreationResponse(selectedEncList).subscribe((res: any) => {
      expect(res).toEqual(exchangeSetDetailsMockData);
    });
  });

});

export const exchangeSetDetailsMockData: any = {
  "_links": {
    "exchangeSetBatchStatusUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621/status"
    },
    "exchangeSetBatchDetailsUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621"
    },
    "exchangeSetFileUri": {
      "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/3e947b33-2ce0-4b9b-b0e0-e512cdfab621/files/V01X01.zip"
    }
  },
  "exchangeSetUrlExpiryDateTime": "2022-09-02T06:37:34.732Z",
  "requestedProductCount": 19,
  "exchangeSetCellCount": 4,
  "requestedProductsAlreadyUpToDateCount": 0,
  "requestedProductsNotInExchangeSet": [
    {
      "productName": "AU210130",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU220130",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU314128",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU412129",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU415128",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU424150",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU426113",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU432115",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU439146",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5BTB01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5DAM02",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5MEL01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5PTL01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU5SYD01",
      "reason": "invalidProduct"
    },
    {
      "productName": "AU6BTB01",
      "reason": "invalidProduct"
    }
  ]
}
