import { TestBed } from '@angular/core/testing';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { first } from 'rxjs/operators';
describe('EssUploadFileService', () => {
  const getCsvTempData = () => {
    let data = 'AU220150\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };
  
  let csvEncLists: string[];
  let service: EssUploadFileService;
  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 5,
      },
    };
    TestBed.configureTestingModule({});
    service = TestBed.inject(EssUploadFileService);
    csvEncLists = service.getEncFileData(getCsvTempData());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('getEncFileData should return enc file data for csv file', () => {
    let encLists= ['AU220150','AU5PTL01','CA271105','CN484220' ];
    var result = service.getEncFileData(getCsvTempData());
    expect(result).toEqual(encLists);
  });

  it('isValidEncFile should return true/false based on file type and file contents for csv File', () => {
    let isValidEncFile = service.isValidEncFile('text/csv', csvEncLists);
    expect(isValidEncFile).toEqual(true);
    isValidEncFile = service.isValidEncFile('application/json', csvEncLists);
    expect(isValidEncFile).toEqual(false);
  });

  test('extractEncsFromFile should extract encs from file', () => {    
    let encLists= ['AU220150,AU220150', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105' ,'CN484220,CN484220']
    var result = service.extractEncsFromFile("text/csv",encLists); 
    expect(result).toEqual(csvEncLists);
  });

  test('extractEncsFromFile should extract encs from file and also removes blank data', () => {    
    let encLists= ['AU220150,AU220150','', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105' ,'CN484220,CN484220']
    var result = service.extractEncsFromFile("text/csv",encLists); 
    expect(result).toEqual(csvEncLists);
  });

  it('setValidENCs and getValidEncs should return valid encs', () => {
    let encLists= ['AU220150', 'AU5PTL01', 'CA271105' ,'CN484220']
    let validEncList = service.extractEncsFromFile('text/csv',encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });

  it('setValidENCs and getValidEncs should return valid encs when duplicate record found', () => {
    let encLists= ['AU220150,AU220150', 'AU220150,AU220150','AU5PTL01,AU5PTL01', 'CA271105,CA271105' ,'CN484220,CN484220']
    let validEncList = service.extractEncsFromFile('text/csv',encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });


  it('setValidENCs and getValidEncs should return valid encs as per configuration settings', () => {
    let encLists= ['AU220150', 'AU5PTL01', 'CA271105' ,'CN484220','GB50184C','GB50702D','US5AK57M'];
    let validEncList = service.extractEncsFromFile('text/csv',encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(5);
  });

});