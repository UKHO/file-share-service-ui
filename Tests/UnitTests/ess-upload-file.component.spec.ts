import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssUploadFileComponent } from '../../src/app/features/exchange-set/ess-upload-file/ess-upload-file.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { By } from '@angular/platform-browser';
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { FileInputChangeEventDetail } from '@ukho/admiralty-core';
import { HttpClientModule } from '@angular/common/http';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { MockMSALInstanceFactory } from './fss-advanced-search.component.spec';
import { ScsProductInformationService } from '../../src/app/core/services/scs-product-information-api.service';

describe('EssUploadFileComponent', () => {
  let component: EssUploadFileComponent;
  let fixture: ComponentFixture<EssUploadFileComponent>;
  let essUploadFileService: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let msalService: MsalService;
  let scsProductInformationService: ScsProductInformationService;
  const getEncData_csv = () => {
    let data = 'Au2fg150\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };

  const getInvalidEncData_csv = () => {
    let data = 'AU220150004\r\naU5PTLn1\r\ncA27Y105\r\nCN48tk20';
    return data;
  };

  const getNoEncData_csv = () => {
    let data = '';
    return data;
  };

  const getAioEncData_csv = () => {
    let data = 'GB800001';
    return data;
  };

  const getEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'Am210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const getInvalidEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const getNoEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += ':ECS \n';
    return data;
  };
  const getInvalidAndAioEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'GB800001202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const router = {
    navigate: jest.fn()
  };
  const getNEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU20130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU310130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU410130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU510130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU610130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU710130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU810130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU90130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU2110130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB61C,0,5,GB \n';
    data += 'AU230130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB671C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };

  const getNDeltaEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'DE4NO13K202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU20130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU310130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU410130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU510130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU610130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU710130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU810130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU90130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU2110130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB61C,0,5,GB \n';
    data += 'AU230130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB671C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  
  const getNEncDataWithAio = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU20130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU310130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU410130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU510130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU610130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU710130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU810130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU90130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'AU2110130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB61C,0,5,GB \n';
    data += 'GB800001202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB671C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DesignSystemModule, HttpClientModule],
      declarations: [EssUploadFileComponent, EssInfoErrorMessageComponent],
      providers: [
        {
          provide: Router,
          useValue: router
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MockMSALInstanceFactory
        },
        {
          provide : ScsProductInformationService,
          useValue : scsProductInformationService
        },
        {
          provide : MsalService,
          useValue : msalService
        },
        EssUploadFileService,
        EssInfoErrorMessageService,
        MsalService,
        ScsProductInformationService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit: 5,
        aioExcludeEncs: ["GB800001", "FR800001"]
      }
    };

    fixture = TestBed.createComponent(EssUploadFileComponent);
    component = fixture.componentInstance;
    essUploadFileService = TestBed.inject(EssUploadFileService);
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    msalService = TestBed.inject(MsalService);
    scsProductInformationService = TestBed.inject(ScsProductInformationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each`
    messageType     | messageDesc
    ${'info'}       | ${'test info 1'}
    ${'error'}      | ${'test error 1'}
    ${'success'}    | ${'test success 1'}
    ${'warning'}    | ${'test warning 1'}
    ${'info'}       | ${'test info 2'}
    ${'error'}      | ${'test error 3'}
    ${'success'}    | ${'test success 4'}
    ${'warning'}    | ${'test warning 5'}
    `('showMessage should set correct mesages : $messageType , $messageDesc',
    ({ messageType, messageDesc }: { messageType: 'info' | 'warning' | 'success' | 'error'; messageDesc: string }) => {
      const errObj = {
        showInfoErrorMessage: true,
        messageType,
        messageDesc
      };
      component.triggerInfoErrorMessage(errObj.showInfoErrorMessage, errObj.messageType, errObj.messageDesc);
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    }
  );

  it.each`
    fileType                          | fileName           | encDataFunc          | expectedResult
    ${'text/csv'}                     | ${'test.csv'}      | ${getEncData_csv()}  |  ${4}
    ${'application/vnd.ms-excel'}     | ${'test.csv'}      | ${getEncData_csv()}  |  ${4}
    ${'text/plain'}                   | ${'test.txt'}      | ${getEncData()}      |  ${1}
    `('processEncFile should set encList',
    ({ fileType, fileName, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([encDataFunc], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      expect(component.validEncList).toBeUndefined();
      component.processEncFile(encDataFunc);
      expect(component.validEncList.length).toBe(expectedResult);
    });
  it.each`
    fileType           |fileName           | encDataFunc          | expectedResult
    ${'text/csv'}                     | ${'test.csv'}      | ${getEncData_csv()}  |  ${4}
    ${'application/vnd.ms-excel'}     | ${'test.csv'}      | ${getEncData_csv()}  |  ${4}
   ${'text/plain'}                   | ${'test.txt'}      | ${getEncData()}      |  ${1}
    `('processEncFile should set encList',
    ({ fileType, fileName, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([encDataFunc], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      expect(component.validEncList).toBeUndefined();
      component.processEncFile(encDataFunc);
      expect(component.validEncList.length).toBe(expectedResult);
    });

  it.each`
    fileType                          |fileName         | getEncData                     | encDataFunc                 | expectedResult
    ${'text/csv'}                     |${'test.csv'}    | ${getInvalidEncData_csv()}     | ${getInvalidEncData_csv()}  |  ${3}
    ${'application/vnd.ms-excel'}     |${'test.csv'}    | ${getInvalidEncData_csv()}     | ${getInvalidEncData_csv()}  |  ${3}
    ${'text/plain'}    |${'test.txt'} | ${getInvalidEncData()}         | ${getInvalidEncData()}      |  ${1}
    `('processEncFile should set raise "Some values have not been added to list." info',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(encDataFunc);
      expect(component.validEncList.length).toEqual(expectedResult);
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'info',
        messageDesc: 'Some values have not been added to list.'
      };

      scsProductInformationService.productUpdatesByIdentifiersResponse(component.validEncList).subscribe((res: any) => {
        scsProductInformationService.productInformationSinceDateTime().subscribe(
          (result:any)=>{
                 var products =  result.products.filter((v: { productName: any; }) => res.products.some((vd: { productName: any; }) => v.productName == vd.productName));
                 if(res.productCounts.requestedProductsNotReturned.length != 0){
                  expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
                 }
                }
        );
      });
    });

  it.each`
     encDataFunc
               ${getEncData_csv()}  
     ${getEncData()}      
    `('processEncFile should set raise "Please upload valid ENC file." error',
    ({ encDataFunc }: { encDataFunc: string }) => {
      const file = new File([encDataFunc], 'test.jpeg');
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toBeUndefined();
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'error',
        messageDesc: 'Please upload valid ENC file.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });

    it.each`
    fileType           |fileName         | getEncData              | encDataFunc            | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getEncData_csv()}     | ${getNoEncData_csv()}  |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getEncData()}         | ${getNoEncData()}      |  ${1}
    `('processEncFile should set raise "No valid ENCs found. info',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toEqual([]);
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'info',
        messageDesc: 'No valid ENCs found.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });



    it.each`
    fileType           |fileName         | getEncData              | encDataFunc                 | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getEncData_csv()}     | ${getAioEncData_csv()}      |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getEncData()}         | ${getInvalidAndAioEncData()}|  ${1}
    `('processEncFile should set raise AIO is not available. info',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      console.log(encDataFunc);
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toEqual([]);
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'info',
        messageDesc: `No valid ENCs found. <br/> AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.`
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });


    it('onFileInputChange{ event.srcElement} should raise error for unsupported file type', () => {
      const file = new File([getEncData_csv()], 'test.jpeg');
      Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      const event: CustomEvent<FileInputChangeEventDetail> = new CustomEvent<FileInputChangeEventDetail>(
        "fileInputChange",
        { detail: { files: [file] } });

      const errObj = {
        showInfoErrorMessage: false,
        messageType: 'info',
        messageDesc: ''
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
      component.onFileInputChange(event as unknown as Event);
      expect(component.validEncList.length).toEqual(0);
      const errObJ = {
        showInfoErrorMessage: true,
        messageType: 'error',
        messageDesc: 'Please select a .csv or .txt file'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
    });

    it('onFileInputChange{ event.srcElement} should raise error if more than one file submitted', () => {
      const file = new File([getEncData_csv()], 'test.jpeg');
      Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      const event: CustomEvent<FileInputChangeEventDetail> = new CustomEvent<FileInputChangeEventDetail>(
        "fileInputChange",
        { detail: { files: [file, file] } });
      
      const errObj = {
        showInfoErrorMessage: false,
        messageType: 'info',
        messageDesc: ''
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
      component.onFileInputChange(event as unknown as Event);
      expect(component.validEncList.length).toEqual(0);
      const errObJ = {
        showInfoErrorMessage: true,
        messageType: 'error',
        messageDesc: 'Only one file can be processed at a time.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
    });

    it.each`
    encDataFunc                   | expectedResult
    ${getNEncDataWithAio}         | ${true}
    ${getEncData}                 | ${false}
      `('infomessage should show message AIO is not available when AIO Enc is found in the ENC list',
      ({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
        const fileContent = encDataFunc();
        const file = new File([fileContent], 'test.txt');
        Object.defineProperty(file, 'type', { value: 'text/plain' });
        component.encFile = file;
        essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
        essUploadFileService.exchangeSetDownloadType = 'Delta';
        component.processEncFile(fileContent);
        var aioEns=essUploadFileService.aioEncFound;
        if(aioEns){
          const errObJ = {
            showInfoErrorMessage: expectedResult,
            messageType: 'info',
            messageDesc: 'AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.<br/> Some values have not been added to list.'
          };
          scsProductInformationService.productUpdatesByIdentifiersResponse(component.validEncList).subscribe((res: any) => {
            scsProductInformationService.productInformationSinceDateTime().subscribe(
              (result:any)=>{
                     var products =  result.products.filter((v: { productName: any; }) => res.products.some((vd: { productName: any; }) => v.productName == vd.productName));
                     if(aioEns){
                      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
                      expect(essUploadFileService.infoMessage).toBe(expectedResult);
                     }
                    }
            );
          });
        } 
        
      });

  test('should show the explaination text in ess upload file component with max enc limit from config', () => {
    const fixture = TestBed.createComponent(EssUploadFileComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('You can upload a permit file or csv file with up to 10 ENCs listed. If your list is longer, please split them and load as separate files. ');
  });

  test('should show the explaination text  in upload file component with max enc selection limit from config', () => {
    const fixture = TestBed.createComponent(EssUploadFileComponent);
    fixture.detectChanges();
    const essLandingPageText = fixture.debugElement.queryAll(By.css('p'));
    for (var i = 0; i < essLandingPageText.length; i++) {
      if (i == essLandingPageText.length - 1)
        expect(essLandingPageText[i].nativeElement.innerHTML).toBe('Once you have uploaded a list, you can then make an exchange set containing a maximum of 5 individual ENCs. ');
    }
  });

  it.each`
    encDataFunc                   | expectedResult
    ${getNDeltaEncData}         | ${true}
    ${getEncData}                 | ${false}
      `('should show delta respone',
      ({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
        const fileContent = encDataFunc();
        const file = new File([fileContent], 'test.txt');
        Object.defineProperty(file, 'type', { value: 'text/plain' });
        component.encFile = file;
        essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
        essUploadFileService.exchangeSetDownloadType = 'Delta';
        component.processEncFile(fileContent);

          scsProductInformationService.productUpdatesByIdentifiersResponse(component.validEncList).subscribe((res: any) => {
            scsProductInformationService.productInformationSinceDateTime().subscribe(
              (result:any)=>{
                     var products =  result.products.filter((v: { productName: any; }) => res.products.some((vd: { productName: any; }) => v.productName == vd.productName));
                     expect(products.productName).toEqual(component.validEncList[0]);
                    }
            );
          }); 
        
      });



});
