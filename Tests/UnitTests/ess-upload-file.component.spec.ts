import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, FileInputComponent } from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssUploadFileComponent } from '../../src/app/features/exchange-set/ess-upload-file/ess-upload-file/ess-upload-file.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { Router } from '@angular/router';

describe('EssUploadFileComponent', () => {
  let component: EssUploadFileComponent;
  let fixture: ComponentFixture<EssUploadFileComponent>;
  let essUploadFileService: EssUploadFileService;

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
    navigate : jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule],
      declarations: [EssUploadFileComponent],
      providers: [
        EssUploadFileService ,
        {
          provide : Router,
          useValue : router
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit:5
      }
    };

    fixture = TestBed.createComponent(EssUploadFileComponent);
    component = fixture.componentInstance;
    essUploadFileService = TestBed.inject(EssUploadFileService);
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
      component.displayErrorMessage = true;
      component.showMessage(messageType, messageDesc);
      expect(component.messageType).toEqual(messageType);
      expect(component.messageDesc).toEqual(messageDesc);
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
      expect(component.messageType).toEqual('error');
      expect(component.messageDesc).toEqual('Please upload valid ENC file.');
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
      expect(component.messageType).toEqual('info');
      expect(component.messageDesc).toEqual('No ENCs found.');
    });

  it('uploadListener should raise error for unsupported file type', () => {
    const file = new File([getEncData_csv()], 'test.jpeg');
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
    Object.defineProperty(file, 'type', { value: 'image/jpeg' });
    const event = {
      srcElement: {
        files: [file]
      }
    };
    expect(component.displayErrorMessage).toBe(false);
    component.uploadListener(event);
    expect(component.validEncList.length).toEqual(0);
    expect(component.messageType).toEqual('error');
    expect(component.messageDesc).toEqual('Please select a .csv or .txt file');
    expect(component.displayErrorMessage).toBe(true);
  });

});

