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
  const getENCDifferentCaseData = () => {
    let data = '';
    data += ':DATE 20220630 03:11 \n';
    data += ':VERSION 2 \n';
    data += ':ENC \n';
    data +=
      'aU21aD130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB \n';
    data += ':ECS \n';
    return data;
  };
  const getCsvTempData = () => {
    const data = 'AU220150\r\nAU5PTL01\r\nCA271105\r\nCN484220';
    return data;
  };
  const getTempEncs = () => [
    'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
    'AU210240202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
  ];
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
  let permitJson: string[];
  let csvEncLists: string[];
  let service: EssUploadFileService;
  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit: 5,
        avgSizeofENCinMB:0.3,
        defaultEstimatedSizeinMB:0.5
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
  it('getValidEncs should return encs uploaded with different case', () => {
    expect(service.getValidEncs()).toBeUndefined();
    let encList = service.getEncFileData(getENCDifferentCaseData());
    encList = service.extractEncsFromFile('text/plain', encList);
    service.setValidENCs(encList);
    encList = service.getValidEncs();
    expect(encList.length).toEqual(1);
  });
  it('validateENCFormat should return enc if passed parameter is valid else returns null', () => {
    const validData = 'A7210130';
    const invalidData = 'A1010130';
    const mixedCaseofData = 'a121C1b0';
    expect(service.validateENCFormat(validData)?.length).toBeGreaterThan(0);
    expect(service.validateENCFormat(invalidData)).toBeNull();
    expect(service.validateENCFormat(mixedCaseofData)?.length).toBeGreaterThan(0);
  });

  //csv file tests
  test('getEncFileData should return enc file data for csv file', () => {
    const encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
    const result = service.getEncFileData(getCsvTempData());
    expect(result).toEqual(encLists);
  });

  it('isValidEncFile should return true/false based on file type and file contents for csv File', () => {
    let isValidEncFile = service.isValidEncFile('text/csv', csvEncLists);
    expect(isValidEncFile).toEqual(true);
    isValidEncFile = service.isValidEncFile('application/json', csvEncLists);
    expect(isValidEncFile).toEqual(false);
  });

  test('extractEncsFromFile should extract encs from file', () => {
    const encLists = ['AU220150,AU220150', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105', 'CN484220,CN484220'];
    const result = service.extractEncsFromFile('text/csv', encLists);
    expect(result).toEqual(csvEncLists);
  });

  test('extractEncsFromFile should extract encs from file and also removes blank data', () => {
    const encLists = ['AU220150,AU220150', '', 'AU5PTL01,AU5PTL01', 'CA271105,CA271105', 'CN484220,CN484220'];
    const result = service.extractEncsFromFile('text/csv', encLists);
    expect(result).toEqual(csvEncLists);
  });

  it('setValidENCs and getValidEncs should return valid encs', () => {
    const encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });

  it('setValidENCs and getValidEncs should return valid encs when duplicate record found', () => {
    const encLists = ['AU220150,Au220150', 'aU220150,au220150', 'Au5PTL01,aU5PTL01', 'cA271105,Ca271105', 'Cn484220,cN484220'];
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(4);
  });

  it('setValidENCs and getValidEncs should return valid encs as per configuration settings', () => {
    // eslint-disable-next-line max-len
    const encLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0', 'JP34R1ES', 'JP44KU49', 'US4FL18M'];
    let validEncList = service.extractEncsFromFile('text/csv', encLists);
    service.setValidENCs(validEncList);
    validEncList = service.getValidEncs();
    expect(validEncList.length).toEqual(10);
  });
  it('service.infoMessage should set true/false', () => {
    expect(service.infoMessage).toBeFalsy();
    service.infoMessage = true;
    expect(service.infoMessage).toBeTruthy();
    service.infoMessage = false;
    expect(service.infoMessage).toBeFalsy();
  });
  it('addSelectedEnc adds enc into selectedEncs', () => {
    expect(service.getSelectedENCs().length).toEqual(0);
    service.addSelectedEnc('AU210130');
    service.addSelectedEnc('AU210230');
    service.addSelectedEnc('AU210330');
    expect(service.getSelectedENCs().length).toEqual(3);
  });
  it('removeSelectedEncs removes enc from selectedEncs', () => {
    expect(service.getSelectedENCs().length).toEqual(0);
    service.addSelectedEnc('AU210130');
    service.addSelectedEnc('AU210230');
    service.addSelectedEnc('AU210330');
    expect(service.getSelectedENCs().length).toEqual(3);
    service.removeSelectedEncs('AU210230');
    expect(service.getSelectedENCs().length).toEqual(2);
  });
  it('clearSelectedEncs clears enc from selectedEncs', () => {
    expect(service.getSelectedENCs().length).toEqual(0);
    service.addSelectedEnc('AU210130');
    service.addSelectedEnc('AU210230');
    service.addSelectedEnc('AU210330');
    expect(service.getSelectedENCs().length).toEqual(3);
    service.clearSelectedEncs();
    expect(service.getSelectedENCs().length).toEqual(0);
  });
  it('valid encs should always be less than MaxEncLimit', () => {
    expect(service.getMaxEncLimit()).toEqual(10);
    let encList = service.getEncFileData(getNEncData());
    encList = service.extractEncsFromFile('text/plain', encList);
    service.setValidENCs(encList);
    expect(encList.length).toBeGreaterThan(service.getMaxEncLimit());
    expect(service.getValidEncs().length).toBeLessThan(service.getMaxEncLimit());
  });

  it('setValidSingleEnc should set single ENC in validEnc list', () => {

    let validEncs = ['AU220150', 'Ay5PTp01', 'CA271105', 'CN484220'];
    service.setValidENCs(validEncs);
    service.addSingleEnc('AS121212');
    service.addSingleEnc('aD1tyH1n');
    let encList = service.getValidEncs();
    expect(encList.length).toEqual(6);
  });

  it('checkMaxEncLimit should return true as per configuration settings', () => {
    let validLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', 'GB50702D', 'US5AK57M', 'HR50017C', 'ID202908', 'JP24S8H0', 'JP34R1ES', 'JP44KU49', 'US4FL18M'];
    expect(service.checkMaxEncLimit(validLists)).toEqual(true);
  });

  it('checkMaxEncLimit should return false as per configuration settings', () => {
    let validLists = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
    expect(service.checkMaxEncLimit(validLists)).toEqual(false);
  });

  it('addSingleEnc should set single ENC in validEnc list', () => {
    let validEncs = ['AU220150', 'Ay5PTp01', 'CA271105', 'CN484220'];
    service.setValidENCs(validEncs);
    service.addSingleEnc('AS121212');
    service.addSingleEnc('aS12rteL');
    expect(service.getValidEncs().length).toEqual(6);
  });

  it.each`
  encCount                       | expectedResult
  ${0}                           |  ${'0.5MB'}
  ${1}                           |  ${'0.8MB'}
  ${6}                           |  ${'2.3MB'}
  `('getEstimatedTotalSize should return valid string',
  ({  encCount, expectedResult }: {  encCount: number; expectedResult: string }) => {
    jest.clearAllMocks();
    expect(service.getEstimatedTotalSize(encCount)).toEqual(expectedResult);
  });
  
});
