import { TestBed } from '@angular/core/testing';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { BundleInfo, DateInfo, NotReturnedProduct, Product } from '../../src/app/core/models/ess-response-types';

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
  let bundleInfo: BundleInfo[] = [];
  let updateNumber: number[] = [];
  let product: Product[] = [];
  let dateInfo: DateInfo[] = [];
  bundleInfo.push({bundleType: 'ABC', location: 'XYZ'});
  dateInfo.push({updateNumber:1, updateApplicationDate: '', issueDate: ''});
  product.push({ productName: 'AU210130', editionNumber: 1, updateNumbers: updateNumber, dates: dateInfo, cancellation: null, fileSize: 26140, ignoreCache: true, bundle: bundleInfo });
  product.push({ productName: 'AU210230', editionNumber: 2, updateNumbers: updateNumber, dates: dateInfo, cancellation: null, fileSize: 343128, ignoreCache: true, bundle: bundleInfo });
  product.push({ productName: 'AU210330', editionNumber: 3, updateNumbers: updateNumber, dates: dateInfo, cancellation: null, fileSize: 123074, ignoreCache: true, bundle: bundleInfo });
  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
        MaxEncLimit: 10,
        MaxEncSelectionLimit: 5,
        defaultEstimatedSizeinMB: 0.5,
        aioExcludeEncs :["GB800001","FR800001"]
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
    service.addSelectedEnc(product[0]);
    service.addSelectedEnc(product[1]);
    service.addSelectedEnc(product[2]);
    expect(service.getSelectedENCs().length).toEqual(3);
  });
  it('removeSelectedEncs removes enc from selectedEncs', () => {
    expect(service.getSelectedENCs().length).toEqual(0);
    service.addSelectedEnc(product[0]);
    service.addSelectedEnc(product[1]);
    service.addSelectedEnc(product[2]);
    expect(service.getSelectedENCs().length).toEqual(3);
    service.removeSelectedEncs('AU210230');
    expect(service.getSelectedENCs().length).toEqual(2);
  });
  it('clearSelectedEncs clears enc from selectedEncs', () => {
    expect(service.getSelectedENCs().length).toEqual(0);
    service.addSelectedEnc(product[0]);
    service.addSelectedEnc(product[1]);
    service.addSelectedEnc(product[2]);
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

  it('should return true for valid encName', () => { 
    const validEncName = 'AU220130';
    const result = service.excludeAioEnc(validEncName); 
    expect(result).toBe(true);  });
  it('should return false for invalid AIO encName', () => { 
    const invalidEncName = 'GB800001';
    const result = service.excludeAioEnc(invalidEncName); 
    expect(result).toBe(false);  });
      it('get exchangeSetDownloadType should return the correct download type', () => {
    service.exchangeSetDownloadType = 'Base';
    expect(service.exchangeSetDownloadType).toEqual('Base');
    
    service.exchangeSetDownloadType = 'Delta';
    expect(service.exchangeSetDownloadType).toEqual('Delta');
  });

  it('set exchangeSetDownloadType should set the correct download type', () => {
    service.exchangeSetDownloadType = 'Base';
    expect(service.exchangeSetDownloadType).toEqual('Base');
    
    service.exchangeSetDownloadType = 'Delta';
    expect(service.exchangeSetDownloadType).toEqual('Delta');
  });
  it('get exchangeSetDeltaDate should return the correct date', () => {
    const date = new Date('2024-01-30');
    service.exchangeSetDeltaDate = date;
    expect(service.exchangeSetDeltaDate).toEqual(date);
  });

  it('set exchangeSetDeltaDate should set the correct date', () => {
    const date = new Date('2024-01-30');
    service.exchangeSetDeltaDate = date;
    expect(service.exchangeSetDeltaDate).toEqual(date);
  });

  it('scsInvalidProducts should return invalid product', () => {
      let notReturnedProduct: NotReturnedProduct[] = [{
        "productName": "US5CN13M",
        "reason": "noDataAvailableForCancelledProduct"
      },
      {
        "productName": "DE521900",
        "reason": "invalidProduct"
      }
      ];
  
      service.scsInvalidProducts = notReturnedProduct;
      expect(service.scsInvalidProducts.length).toEqual(2);
   });

  test('getEstimatedTotalSize calculates total size accurately', () => {
    for (const p of product) {
      service.addSelectedEnc(p);
    }
    const convertBytesToMegabytesSpy = jest.spyOn(service, 'convertBytesToMegabytes');
    const actualTotalSize = service.getEstimatedTotalSize();
    const estimatedSizeInMB = convertBytesToMegabytesSpy.mock.results[0].value;
    
    expect(convertBytesToMegabytesSpy).toHaveBeenCalled();
    expect(typeof estimatedSizeInMB).toBe('number');
    expect(actualTotalSize).toEqual('0.97 MB');
  })
});
