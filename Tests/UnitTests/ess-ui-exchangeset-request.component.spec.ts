import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModule, DialogueModule, FileInputModule } from '@ukho/design-system';
import { EssUiExchangesetRequestComponent } from '../../src/app/features/ess-ui/ess-ui-exchangeset-request/ess-ui-exchangeset-request.component';


describe('EssUiExchangesetRequestComponent', () => {
  let component: EssUiExchangesetRequestComponent;
  let fixture: ComponentFixture<EssUiExchangesetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        FileInputModule, CardModule, DialogueModule ],
      declarations: [EssUiExchangesetRequestComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUiExchangesetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EssUiExchangesetRequestComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should return flag true when file extension is CSV.', () => {
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    var testfile = sampleCsvData();
    var result = component.isValidCSVFile(testfile);
    expect(result).toBe(true);
  });

  test('should return flag false when file extension is other than CSV.', () => {
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    var testfile = new File([SampleCSV], "sample.pdf", { type: 'text/pdf' });
    var result = component.isValidCSVFile(testfile);
    expect(result).toBe(false);
  });

  test('should not return given file type empty', () => {
    const csvRecordsArray = new Array('Enc Data','US2FAS01');
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    var result = component.ValidateCSVFile(csvRecordsArray,csvRecordsArray);
    expect(result).toBe(true); 
    expect(component.errorMessageDescription).toEqual('');
  });

  test('should return given file type empty', () => {
    const csvRecordsArray = new Array(2).fill('');
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    var result = component.ValidateCSVFile(csvRecordsArray,csvRecordsArray);
    expect(component.errorMessageDescription).toEqual('Given csv file is empty.');
    expect(result).toBe(false); 
  });

  test('should not return given csv file is invalid', () => {
    const csvRecordsArray = new Array('Enc Data','US2FAS01');
    let headersRow : any;
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    headersRow = component.getHeaderArray(csvRecordsArray);
    var result = component.ValidateCSVFile(csvRecordsArray,headersRow);
    expect(result).toBe(true); 
    expect(component.errorMessageDescription).toEqual('');
  });

  test('should return given csv file is invalid for invalid header', () => {
    const csvRecordsArray = new Array('Enc Numbers','');
    let headersRow : any;
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    headersRow = component.getHeaderArray(csvRecordsArray);
    var result = component.ValidateCSVFile(csvRecordsArray,headersRow);
    expect(result).toBe(false); 
    expect(component.errorMessageDescription).toEqual('Given csv file is invalid.');
  });

  test('should return given csv file is invalid for valid header with empty rows', () => {
    const csvRecordsArray = new Array('Enc Data','');
    let headersRow : any;
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    headersRow = component.getHeaderArray(csvRecordsArray);
    var result = component.ValidateCSVFile(csvRecordsArray,headersRow);
    expect(result).toBe(false); 
    expect(component.errorMessageDescription).toEqual('Given csv file is invalid.');
  });

  test('should return all ENC data', () => {
    const csvRecordsArray = ['ENC Data','US2FAS01'];
    let headersRow : any;
    component = new EssUiExchangesetRequestComponent();
    component.ngOnInit();
    headersRow = component.getHeaderArray(csvRecordsArray);
    var csvResult = component.getDataRecordsArrayFromCSVFile(
      csvRecordsArray,
      headersRow.length
    );
    var expectedENCDataDisplay = fillCSVData();
    expect(expectedENCDataDisplay).toEqual(csvResult);
  });
});

    const SampleCSV = `ENC Data
    US2FAS01
    DE2NO000
    US4FL44M
    US456630`;

    export function sampleCsvData() {
      return new File([SampleCSV], "sample.csv", { type: 'text/csv' });
    }

    export class CsvData {
      public encnumber: any;
    }
 
    export function fillCSVData()
    {
        let csvArr = [];
        let csvRecord: CsvData = new CsvData();
        csvRecord.encnumber ='US2FAS01';
        csvArr.push(csvRecord);
        return csvArr;
    }

    