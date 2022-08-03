import { TestBed } from '@angular/core/testing';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { first } from 'rxjs/operators';
describe('FssPopularSearchService', () => {
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
  const getTempEncs = () => [
    'AU210130202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
    'AU210240202209307FF74DB298E043887FF74DB298E04388F160D61C8BBB618C,0,5,GB',
  ];
  let permitJson: string[];
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
    rawData = service.extractEncsFromFile(rawData);
    expect(rawData.length).toEqual(1);
  });

  it('extractEncsFromFile should return enc"s if :ENC and :ECS do not exist in file', () => {
    let rawData = getTempEncs();
    expect(rawData.length).toEqual(2);
    rawData = service.extractEncsFromFile(rawData);
    expect(rawData.length).toEqual(2);
  });

  it('getValidEncs should return encs', () => {
    expect(service.getValidEncs()).toBeUndefined();
    let encList = service.getEncFileData(getTempData());
    encList = service.extractEncsFromFile(encList);
    service.setValidEncs(encList);
    encList = service.getValidEncs();
    expect(encList.length).toEqual(1);
  });

  it('validateENCFormat should return enc if passed parameter is valid else returns null', () => {
    const validData = 'AU210130';
    const invalidData = 'A1210130';
    expect(service.validateENCFormat(validData)?.length).toBeGreaterThan(0);
    expect(service.validateENCFormat(invalidData)).toBeNull();
  });

  it('setEncFilterState should set correct true/false state', async () => {
    expect(await service.getEncFilterState().pipe(first()).toPromise()).toEqual(
      false
    );

    service.setEncFilterState(10, 2);
    expect(await service.getEncFilterState().pipe(first()).toPromise()).toEqual(
      true
    );

    service.setEncFilterState(1, 2);
    expect(await service.getEncFilterState().pipe(first()).toPromise()).toEqual(
      false
    );
  });
});
