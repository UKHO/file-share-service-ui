import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DialogueModule, FileInputModule, RadioModule,ButtonModule ,CardModule, FileInputComponent} from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { EssUploadFileComponent } from '../../src/app/features/exchange-set/ess-upload-file/ess-upload-file/ess-upload-file.component';
import { AppConfigService } from '../../src/app/core/services/app-config.service';

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
 let data ='';
  return data;
};


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,DialogueModule,FileInputModule,RadioModule,ButtonModule,CardModule],
      declarations: [ EssUploadFileComponent ],
      providers: [
        EssUploadFileService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
          MaxEncLimit : 10
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
    `(
    'showMessage should set correct mesages : $messageType , $messageDesc',
    ({ messageType, messageDesc }: { messageType: 'info' | 'warning' | 'success' | 'error'; messageDesc: string }) => {
        component.displayErrorMessage = true;
        component.showMessage(messageType,messageDesc);
        expect(component.messageType).toEqual(messageType);
        expect(component.messageDesc).toEqual(messageDesc);
    }
    );

    it('processEncFile should set encList',() => {
      const file = new File([getEncData_csv()], 'test.csv');
      Object.defineProperty(file, 'type', { value: 'text/csv' });
     component.encFile = file;
     expect(component.validEncList).toBeUndefined();
     component.processEncFile(getEncData_csv());
     expect(component.validEncList.length).toBe(4);
    });

    it('processEncFile should set raise "Please upload valid ENC file." error',() => {
      const file = new File([getEncData_csv()], 'test.jpeg');
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      component.encFile = file;
      component.processEncFile(getEncData_csv());
      expect(component.validEncList).toBeUndefined();
      expect(component.messageType).toEqual('error');
      expect(component.messageDesc).toEqual('Please upload valid ENC file.');
    });

    it('processEncFile should set raise "Some values have not been added to list." info',() => {
      const file = new File([getEncData_csv()], 'test.csv');
      Object.defineProperty(file, 'type', { value: 'text/csv' });
      component.encFile = file;
      component.processEncFile(getInvalidEncData_csv());
      expect(component.validEncList.length).toEqual(3);
      expect(component.messageType).toEqual('info');
      expect(component.messageDesc).toEqual('Some values have not been added to list.');
    });
    
    it('processEncFile should set raise "No ENCs found." info',() => {
      const file = new File([getEncData_csv()], 'test.csv');
      Object.defineProperty(file, 'type', { value: 'text/csv' });
      component.encFile = file;
      component.processEncFile(getNoEncData_csv());
      expect(component.validEncList).toEqual([]);
      expect(component.messageType).toEqual('info');
      expect(component.messageDesc).toEqual('No ENCs found.');
    });

    it('uploadListener should raise error if file is not provided' , () =>{
      const file = new File([getEncData_csv()], 'test.jpeg');
      Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
      Object.defineProperty(file, 'type', { value: 'image/jpeg' });
      const event = {
        srcElement : {
          files : [file]
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
