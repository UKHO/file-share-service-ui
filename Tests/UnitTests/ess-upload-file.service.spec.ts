import { TestBed } from '@angular/core/testing';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';

describe('EssUploadFileService', () => {
  const getTempData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data +=
      'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const getCsvTempData = () => {
    let data = 'AU220150\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };
  const getTempEncs = () => [
    'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
    'AU210240202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
  ];
  let permitJson: string[];
  let csvEncLists: string[];
  let service: EssUploadFileService;
  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
      },
    };
    TestBed.configureTestingModule({});
    service = TestBed.inject(EssUploadFileService);
    permitJson = service.getEncFileData(getTempData());
    csvEncLists = service.getEncFileData(getCsvTempData());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEncFileData should return parsed json', () => {
    const data = service.getEncFileData(getTempData());
    expect(data).not.toBeUndefined();
    expect(data).toBeInstanceOf(Array);
  });

  it('isValidEncFile should return true/false based on file type and file contents', () => {
    let isValidEncFile = service.isValidEncFile('text/plain', permitJson);
    expect(isValidEncFile).toEqual(true);
    isValidEncFile = service.isValidEncFile('application/json', permitJson);
    expect(isValidEncFile).toEqual(false);
  });

  it('extractEncsFromFile should return enc"s if :ENC and :ECS exist in file', () => {
    let rawData = permitJson;
    expect(rawData.length).toEqual(5);
    rawData = service.extractEncsFromFile('text/plain', rawData);
    expect(rawData.length).toEqual(1);
  });

  it('extractEncsFromFile should return enc"s if :ENC and :ECS do not exist in file', () => {
    let rawData = getTempEncs();
    expect(rawData.length).toEqual(2);
    rawData = service.extractEncsFromFile('text/plain', rawData);
    expect(rawData.length).toEqual(0);
  });

  it('getValidEncs should return encs', () => {
    expect(service.getValidEncs()).toBeUndefined();
    let encList = service.getEncFileData(getTempData());
    encList = service.extractEncsFromFile('text/plain', encList);
    service.setValidENCs(encList);
    encList = service.getValidEncs();
    expect(encList.length).toEqual(1);
  });

  it('validateENCFormat should return enc if passed parameter is valid else returns null', () => {
    const validData = 'AU210130';
    const invalidData = 'A1210130';
    expect(service.validateENCFormat(validData)?.length).toBeGreaterThan(0);
    expect(service.validateENCFormat(invalidData)).toBeNull();
  });

  //csv file tests
  test('getEncFileData should return enc file data for csv file', () => {
    let encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
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
    let encLists = ['AU220150,AU220150', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105', 'CN484220,CN484220']
    var result = service.extractEncsFromFile("text/csv", encLists);
    expect(result).toEqual(csvEncLists);
  });

  test('extractEncsFromFile should extract encs from file and also removes blank data', () => {
    let encLists = ['AU220150,AU220150', '', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105', 'CN484220,CN484220']
    var result = service.extractEncsFromFile("text/csv", encLists);
    expect(result).toEqual(csvEncLists);
  });

  it('setValidENCs and getValidEncs should return valid encs', () => {
    let encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220']
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });

  it('setValidENCs and getValidEncs should return valid encs when duplicate record found', () => {
    let encLists = ['AU220150,AU220150', 'AU220150,AU220150', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105', 'CN484220,CN484220']
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });

  it('setValidENCs and getValidEncs should return valid encs as per configuration settings', () => {
    let encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0', 'JP34R1ES', 'JP44KU49', 'US4FL18M'];
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(10);
  });

  it('setValidSingleEnc should set single ENC in validEnc list', () => {
    expect(service.setValidSingleEnc('AS121212'));
    let encList = service.getValidEncs();
    expect(encList.length).toEqual(1);
  });
});