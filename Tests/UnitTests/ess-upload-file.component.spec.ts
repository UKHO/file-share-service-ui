import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, FileInputComponent } from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssUploadFileComponent } from '../../src/app/features/exchange-set/ess-upload-file/ess-upload-file.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
describe('EssUploadFileComponent', () => {
  let component: EssUploadFileComponent;
  let fixture: ComponentFixture<EssUploadFileComponent>;
  let essUploadFileService: EssUploadFileService;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  const getEncData_csv = () => {
    let data = 'AU220150\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };

  const getInvalidEncData_csv = () => {
    let data = 'AU220150004\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };

  const getNoEncData_csv = () => {
    let data = '';
    return data;
  };

  const getEncData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data += 'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule],
      declarations: [EssUploadFileComponent,EssInfoErrorMessageComponent],
      providers: [
        {
          provide : Router,
          useValue : router
          },
        EssUploadFileService,
        EssInfoErrorMessageService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit : 5
      }
    };

    fixture = TestBed.createComponent(EssUploadFileComponent);
    component = fixture.componentInstance;
    essUploadFileService = TestBed.inject(EssUploadFileService);
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
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
        showInfoErrorMessage : true,
        messageType,
        messageDesc
      };
      component.triggerInfoErrorMessage(errObj.showInfoErrorMessage,errObj.messageType,errObj.messageDesc);
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    }
  );

  it.each`
    fileType           |fileName           | encDataFunc          | expectedResult
    ${'text/csv'}      |${'test.csv'}      | ${getEncData_csv()}  |  ${4}
    ${'text/plain'}    |${'test.txt'}      | ${getEncData()}      |  ${1}
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
    ${'text/csv'}      |${'test.csv'}      | ${getEncData_csv()}  |  ${4}
    ${'text/plain'}    |${'test.txt'}      | ${getEncData()}      |  ${1}
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
    fileType           |fileName         | getEncData                     | encDataFunc                 | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getInvalidEncData_csv()}     | ${getInvalidEncData_csv()}  |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getInvalidEncData()}         | ${getInvalidEncData()}      |  ${1}
    `('processEncFile should set raise "Some values have not been added to list." info',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList.length).toEqual(expectedResult);
      const errObj = {
        showInfoErrorMessage : true,
        messageType : 'info',
        messageDesc : 'Some values have not been added to list.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
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
        showInfoErrorMessage : true,
        messageType : 'error',
        messageDesc : 'Please upload valid ENC file.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });

  it.each`
    fileType           |fileName         | getEncData              | encDataFunc                 | expectedResult
    ${'text/csv'}      |${'test.csv'}    | ${getEncData_csv()}     | ${getNoEncData_csv()}  |  ${3}
    ${'text/plain'}    |${'test.txt'}    | ${getEncData()}         | ${getNoEncData()}      |  ${1}
    `('processEncFile should set raise "No ENCs found." info',
    ({ fileType, fileName, getEncData, encDataFunc, expectedResult }: { fileType: 'text/csv' | 'text/permit'; fileName: string; getEncData: string; encDataFunc: string; expectedResult: number }) => {
      const file = new File([getEncData], fileName);
      Object.defineProperty(file, 'type', { value: fileType });
      component.encFile = file;
      component.processEncFile(encDataFunc);
      expect(component.validEncList).toEqual([]);
      const errObj = {
        showInfoErrorMessage : true,
        messageType : 'info',
        messageDesc : 'No ENCs found.'
      };
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    });

  it('uploadListener{ event.srcElement} should raise error for unsupported file type', () => {
    const file = new File([getEncData_csv()], 'test.jpeg');
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
    Object.defineProperty(file, 'type', { value: 'image/jpeg' });
    const event = {
      srcElement: {
        files: [file]
      }
    };
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    component.uploadListener(event);
    expect(component.validEncList.length).toEqual(0);
    const errObJ = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Please select a .csv or .txt file'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
  });

  it('uploadListener{ event.dataTransfer} should raise error for unsupported file type', () => {
    const file = new File([getEncData_csv()], 'test.jpeg');
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
    Object.defineProperty(file, 'type', { value: 'image/jpeg' });
    const event = {
      dataTransfer: {
        files: [file]
      }
    };
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    component.uploadListener(event);
    expect(component.validEncList.length).toEqual(0);
    const errObJ = {
      showInfoErrorMessage : true,
      messageType : 'error',
      messageDesc : 'Please select a .csv or .txt file'
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
  });

  it.each`
  encDataFunc       | expectedResult
  ${getNEncData}    | ${true}
  ${getEncData}     | ${false}
    `('infomessage is true when enc list count exceeds MaxEncLimit',
    ({ encDataFunc, expectedResult }: { encDataFunc: () => string,  expectedResult: boolean }) => {
      const fileContent = encDataFunc();
      const file = new File([fileContent], 'test.txt');
      Object.defineProperty(file, 'type', { value: 'text/plain' });
      component.encFile = file;
      component.processEncFile(fileContent);
      const errObJ = {
        showInfoErrorMessage : false,
        messageType : 'info',
        messageDesc : ''
      };
      if(expectedResult){
        errObJ.showInfoErrorMessage = expectedResult;
        errObJ.messageType = 'info';
        errObJ.messageDesc = 'Some values have not been added to list.';
      }
      expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObJ);
      expect(essUploadFileService.infoMessage).toBe(expectedResult);
    });
});
