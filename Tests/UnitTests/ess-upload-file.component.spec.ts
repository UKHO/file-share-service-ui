import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { ScsProductInformationApiService } from '../../src/app/core/services/scs-product-information-api.service';
import { of, throwError } from 'rxjs';

describe('EssUploadFileComponent', () => {
  let component: EssUploadFileComponent;
  let fixture: ComponentFixture<EssUploadFileComponent>;
  let essUploadFileService: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let msalService: MsalService;
  let scsProductInformationApiService: ScsProductInformationApiService;
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
  const validAndInvalidEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'GB20486A202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'FR570300202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'GB800001202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'DE521900202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const ValidAndAioEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'GB800001202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += 'CA172005202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
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
  const getNDeltaEncDatawithAIO = () => {
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
    data += 'GB800001202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
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
          provide: ScsProductInformationApiService,
          useValue: scsProductInformationApiService
        },
        {
          provide: MsalService,
          useValue: msalService
        },
        EssUploadFileService,
        EssInfoErrorMessageService,
        MsalService,
        ScsProductInformationApiService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit: 5
      }
    };

    fixture = TestBed.createComponent(EssUploadFileComponent);
    component = fixture.componentInstance;
    essUploadFileService = TestBed.inject(EssUploadFileService);
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    msalService = TestBed.inject(MsalService);
    scsProductInformationApiService = TestBed.inject(ScsProductInformationApiService);
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
     encDataFunc
               ${getEncData_csv()}  
     ${getEncData()}      
    `('processEncFile should set raise "Please upload valid ENC file" error',
    ({ encDataFunc }: { encDataFunc: string }) => {
      const file = new File([encDataFunc], 'test.jpeg');
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toBeUndefined();
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'error',
        messageDesc: 'Please upload valid ENC file'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });

  it.each`
    fileType           |fileName         | getEncData              | encDataFunc            | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getEncData_csv()}     | ${getNoEncData_csv()}  |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getEncData()}         | ${getNoEncData()}      |  ${1}
    `('processEncFile should set raise "No valid ENCs found. error',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toEqual([]);
      const errObj = {
        showInfoErrorMessage: true,
        messageType: 'error',
        messageDesc: 'No valid ENCs found'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });

  it.each`
    fileType           |fileName         | getEncData              | encDataFunc                 | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getEncData_csv()}     | ${getAioEncData_csv()}      |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getEncData()}         | ${getInvalidAndAioEncData()}|  ${1}
    `('processEncFile should set raise AIO is not available. error',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      console.log(encDataFunc);
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toEqual(["GB800001"]);
      const infoObj = {
        showInfoErrorMessage: false,
        messageType: 'info',
        messageDesc: ``
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(infoObj);
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
      messageDesc: 'Only one file can be processed at a time'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
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

  it('should return sales catalogue Response on productUpdatesByIdentifiersResponse', fakeAsync(() => {
    let addedEncList = ['FR570300', 'SE6IIFE1', 'NO3B2020'];
    jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
    component.productUpdatesByIdentifiersResponse(addedEncList)
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(3).toEqual(scsProductIdentifiersResponseMockData.productCounts.returnedProductCount);
  }));

  it('should return Error message for productUpdatesByIdentifiersResponse', fakeAsync(() => {
    let addedEncList = ['FR570300', 'SE6IIFE1', 'NO3B2020'];
    jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(throwError(scsProductIdentifiersResponseMockData));
    component.triggerInfoErrorMessage = jest.fn();
    component.fetchScsTokenReponse();
    component.productUpdatesByIdentifiersResponse(addedEncList);
    tick();
    expect(component.displayLoader).toEqual(false);
    expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
  }));

  it.each`
encDataFunc                   | expectedResult
${getEncData}                 | ${false}
  `('System should raise error message for all invalid encs',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      //essUploadFileService.aioEncFound = false;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'No valid ENCs found');
    }));

  it.each`
encDataFunc                   | expectedResult
${getEncData}                 | ${false}
  `('System should raise error message for all invalid encs with aio',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      component.processEncFile(fileContent);
      //essUploadFileService.aioEncFound = true;
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'No valid ENCs found');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
  `('should return sales catalogue Response for Delta',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductsFromSinceDateTimeByScsResponseMockData));
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList)
      const routeService = jest.spyOn(router, 'navigate');
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.scsResponse.products[0].productName).toEqual(scsProductsFromSinceDateTimeByScsResponseMockData.products[0].productName);
      expect(routeService).toHaveBeenCalledWith(['exchangesets', 'enc-list']);
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
  `('productUpdatesByDeltaResponse should return Error message for productUpdatesByIdentifiersResponse',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(throwError(scsProductIdentifiersResponseMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
  `('productUpdatesByDeltaResponse should return Error message for productInformationSinceDateTime',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError(scsProductIdentifiersResponseMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'There has been an error');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
  `('validatation should raise "No valid ENCs found" info',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'No valid ENCs found');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
  `('validation should raise "There has been no updates for the ENCs in the date range selected"info',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'info', 'There have been no updates for the ENCs in the date range selected');
    }));

  it.each`
encDataFunc                   | expectedResult
${ValidAndAioEncData}         | ${true}
`('validation should raise for AIO cell when product updates are not available',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      ///essUploadFileService.aioEncFound = true;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsResponseForSinceDateTimeMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, "info", "There have been no updates for the ENCs in the date range selected");
    }));

  it.each`
encDataFunc                   | expectedResult
${ValidAndAioEncData}         | ${true}
`('validation should raise for AIO cell and invalid cell when product updates are not available',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      component.processEncFile(fileContent);
      //essUploadFileService.aioEncFound = true;
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsInvalidProductsResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, "error", "Invalid cells -  US5CN13M, DE521900. <br/> There have been no updates for the ENCs in the date range selected.");
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
`('validation should raise "There has been no updates for the ENCs in the date range selected"info when product updates not available',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = false;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'info', 'There have been no updates for the ENCs in the date range selected');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
`('validation should raise invalid cell when product updates are not available',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = false;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsInvalidProductsResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'Invalid cells -  US5CN13M, DE521900. <br/> There have been no updates for the ENCs in the date range selected.');
    }));

  it.each`
encDataFunc                   | expectedResult
${ValidAndAioEncData}         | ${true}
`('validation should raise for AIO cell when product updates are not available (304 not modified response)',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = true;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError({ status: 304 }));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, "info", "There have been no updates for the ENCs in the date range selected");
    }));

  it.each`
encDataFunc                   | expectedResult
${ValidAndAioEncData}         | ${true}
`('validation should raise aio and invalid cell when product updates are not available (304 not modified response)',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = true;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsInvalidProductsResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError({ status: 304 }));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, "error", "Invalid cells -  US5CN13M, DE521900. <br/> There have been no updates for the ENCs in the date range selected.");
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
`('validation should raise "There has been no updates for the ENCs in the date range selected"info when product updates not available (304 not modified response)',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = false;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductIdentifiersResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError({ status: 304 }));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'info', 'There have been no updates for the ENCs in the date range selected');
    }));

  it.each`
encDataFunc                   | expectedResult
${getNDeltaEncData}           | ${true}
${getEncData}                 | ${false}
`('validation should raise invalid cell when product updates are not available (304 not modified response)',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = false;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsInvalidProductsResponseMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(throwError({ status: 304 }));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'Invalid cells -  US5CN13M, DE521900. <br/> There have been no updates for the ENCs in the date range selected.');
    }));

  it.each`
encDataFunc                         | expectedResult
${getInvalidAndAioEncData}          | ${false}
  `('validatation should raise "No valid ENCs found" and AIO message info',
    fakeAsync(({ encDataFunc, expectedResult }: { encDataFunc: () => string, expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      essUploadFileService.exchangeSetDeltaDate = 'Thu, 07 Mar 2024 07:14:24 GMT';
      essUploadFileService.exchangeSetDownloadType = 'Delta';
      //essUploadFileService.aioEncFound = true;
      component.processEncFile(fileContent);
      jest.spyOn(scsProductInformationApiService, 'scsProductIdentifiersResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      jest.spyOn(scsProductInformationApiService, 'getProductsFromSpecificDateByScsResponse').mockReturnValue(of(scsProductResponseWithEmptyProductMockData));
      component.triggerInfoErrorMessage = jest.fn();
      component.fetchScsTokenReponse();
      component.scsProductCatalogResponse(component.validEncList);
      tick();
      expect(component.displayLoader).toEqual(false);
      expect(component.triggerInfoErrorMessage).toHaveBeenCalledWith(true, 'error', 'No valid ENCs found');
    }));

  it('loadFileReader should raise error for unsupported file type', () => {
    const file = new File([getEncData_csv()], 'test.jpeg');
    component.encFile = file;
    component.loadFileReader();
    const errObJ = {
      showInfoErrorMessage: true,
      messageType: 'error',
      messageDesc: 'Please select a .csv or .txt file'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
  });
});


export const scsProductIdentifiersResponseMockData: any = {
  "products": [
    {
      "productName": "FR570300",
      "editionNumber": 1,
      "updateNumbers": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "dates": [
        {
          "updateNumber": 0,
          "updateApplicationDate": "2015-02-25T00:00:00Z",
          "issueDate": "2015-02-25T00:00:00Z"
        },
        {
          "updateNumber": 1,
          "updateApplicationDate": null,
          "issueDate": "2016-04-27T00:00:00Z"
        },
        {
          "updateNumber": 2,
          "updateApplicationDate": null,
          "issueDate": "2017-01-09T00:00:00Z"
        },
        {
          "updateNumber": 3,
          "updateApplicationDate": null,
          "issueDate": "2017-03-20T00:00:00Z"
        },
        {
          "updateNumber": 4,
          "updateApplicationDate": null,
          "issueDate": "2017-11-14T00:00:00Z"
        },
        {
          "updateNumber": 5,
          "updateApplicationDate": null,
          "issueDate": "2017-12-11T00:00:00Z"
        },
        {
          "updateNumber": 6,
          "updateApplicationDate": null,
          "issueDate": "2018-12-19T00:00:00Z"
        },
        {
          "updateNumber": 7,
          "updateApplicationDate": null,
          "issueDate": "2019-06-28T00:00:00Z"
        },
        {
          "updateNumber": 8,
          "updateApplicationDate": null,
          "issueDate": "2019-10-24T00:00:00Z"
        },
        {
          "updateNumber": 9,
          "updateApplicationDate": null,
          "issueDate": "2021-05-11T00:00:00Z"
        },
        {
          "updateNumber": 10,
          "updateApplicationDate": null,
          "issueDate": "2021-10-08T00:00:00Z"
        },
        {
          "updateNumber": 11,
          "updateApplicationDate": null,
          "issueDate": "2022-11-16T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 343128,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B1"
        }
      ]
    },
    {
      "productName": "SE6IIFE1",
      "editionNumber": 13,
      "updateNumbers": [
        0
      ],
      "dates": [
        {
          "updateNumber": 0,
          "updateApplicationDate": "2021-03-26T00:00:00Z",
          "issueDate": "2021-03-26T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 7215,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B1"
        }
      ]
    },
    {
      "productName": "NO3B2020",
      "editionNumber": 2,
      "updateNumbers": [
        0
      ],
      "dates": [
        {
          "updateNumber": 0,
          "updateApplicationDate": "2023-05-09T00:00:00Z",
          "issueDate": "2023-05-09T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 637942,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B2"
        }
      ]
    }
  ],
  "productCounts": {
    "requestedProductCount": 3,
    "returnedProductCount": 3,
    "requestedProductsAlreadyUpToDateCount": 0,
    "requestedProductsNotReturned": []
  }
}

export const scsResponseForSinceDateTimeMockData: any = {
  "products": [
    {
      "productName": "FR570301",
      "editionNumber": 13,
      "updateNumbers": [
        0
      ],
      "dates": [
        {
          "updateNumber": 0,
          "updateApplicationDate": "2021-03-26T00:00:00Z",
          "issueDate": "2021-03-26T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 7215,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B1"
        }
      ]
    },
  ],
  "productCounts": {
    "requestedProductCount": 1,
    "returnedProductCount": 1,
    "requestedProductsAlreadyUpToDateCount": 0,
    "requestedProductsNotReturned": []
  }
}

export const scsProductResponseWithEmptyProductMockData: any = {
  "products": [
  ],
  "productCounts": {
    "requestedProductCount": 0,
    "returnedProductCount": 0,
    "requestedProductsAlreadyUpToDateCount": 0,
    "requestedProductsNotReturned": []
  }
}

export const scsInvalidProductsResponseMockData: any = {
  "products": [
    {
      "productName": "CA172005",
      "editionNumber": 13,
      "updateNumbers": [
        0
      ],
      "dates": [
        {
          "updateNumber": 0,
          "updateApplicationDate": "2021-03-26T00:00:00Z",
          "issueDate": "2021-03-26T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 7215,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B1"
        }
      ]
    }
  ],
  "productCounts": {
    "requestedProductCount": 0,
    "returnedProductCount": 0,
    "requestedProductsAlreadyUpToDateCount": 0,
    "requestedProductsNotReturned": [{
      "productName": "US5CN13M",
      "reason": "noDataAvailableForCancelledProduct"
    },
    {
      "productName": "DE521900",
      "reason": "invalidProduct"
    }
    ]
  }
}

export const scsProductsFromSinceDateTimeByScsResponseMockData: any = {
  "products": [
    {
      "productName": "FR570300",
      "editionNumber": 1,
      "updateNumbers": [
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "dates": [
        {
          "updateNumber": 5,
          "updateApplicationDate": "2021-03-26T00:00:00Z",
          "issueDate": "2017-12-11T00:00:00Z"
        },
        {
          "updateNumber": 6,
          "updateApplicationDate": null,
          "issueDate": "2018-12-19T00:00:00Z"
        },
        {
          "updateNumber": 7,
          "updateApplicationDate": null,
          "issueDate": "2019-06-28T00:00:00Z"
        },
        {
          "updateNumber": 8,
          "updateApplicationDate": null,
          "issueDate": "2019-10-24T00:00:00Z"
        },
        {
          "updateNumber": 9,
          "updateApplicationDate": null,
          "issueDate": "2021-05-11T00:00:00Z"
        },
        {
          "updateNumber": 10,
          "updateApplicationDate": null,
          "issueDate": "2021-10-08T00:00:00Z"
        },
        {
          "updateNumber": 11,
          "updateApplicationDate": null,
          "issueDate": "2022-11-16T00:00:00Z"
        }
      ],
      "cancellation": null,
      "fileSize": 343128,
      "ignoreCache": false,
      "bundle": [
        {
          "bundleType": "DVD",
          "location": "M1;B1"
        }
      ]
    }
  ],
  "productCounts": {
    "requestedProductCount": 1,
    "returnedProductCount": 1,
    "requestedProductsAlreadyUpToDateCount": 0,
    "requestedProductsNotReturned": []
  }
}