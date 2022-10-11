import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, FileInputComponent } from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssUploadFileComponent } from '../../src/app/features/exchange-set/ess-upload-file/ess-upload-file.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

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
      declarations: [EssUploadFileComponent],
      providers: [
        {
          provide : Router,
          useValue : router
          },
        EssUploadFileService
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
      expect(component.messageType).toEqual('info');
      expect(component.messageDesc).toEqual('Some values have not been added to list.');
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

  it('uploadListener{ event.srcElement} should raise error for unsupported file type', () => {
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

  it('uploadListener{ event.dataTransfer} should raise error for unsupported file type', () => {
    const file = new File([getEncData_csv()], 'test.jpeg');
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
    Object.defineProperty(file, 'type', { value: 'image/jpeg' });
    const event = {
      dataTransfer: {
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
      expect(essUploadFileService.infoMessage).toBe(expectedResult);
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
        if(i == essLandingPageText.length-1)
        expect(essLandingPageText[i].nativeElement.innerHTML).toBe('Once you have uploaded a list, you can then make an exchange set containing a maximum of 5 individual ENCs. ');
      }
    });
  
});