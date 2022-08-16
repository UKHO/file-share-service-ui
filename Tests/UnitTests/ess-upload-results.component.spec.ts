import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUploadResultsComponent } from '../../src/app/features/exchange-set/ess-upload-results/ess-upload-results.component';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule} from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { CommonModule } from '@angular/common';
describe('EssUploadResultsComponent', () => {
  let component: EssUploadResultsComponent;
  let fixture: ComponentFixture<EssUploadResultsComponent>;
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule, CheckboxModule],
      declarations: [ EssUploadResultsComponent ],
      providers: [
        {
          provide : EssUploadFileService,
          useValue : service
        }

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };
    fixture = TestBed.createComponent(EssUploadResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set info message if displayErrorMessage is set to true on ngOnInit' ,() => {
    component.ngOnInit();
    expect(component.displayErrorMessage).toBeTruthy();
    expect(component.encList.length).toEqual(5);
    expect(component.messageType).toEqual('info');
    expect(component.messageDesc).toEqual('Some values have not been added to list.');
  });
  it('handleChange should call service.removeSelectedEncs if enc is already present' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210130');
    expect(service.removeSelectedEncs).toHaveBeenCalled();
  });
  it('handleChange should call service.addSelectedEnc if enc is not present' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.handleChange('AU210180');
    expect(service.addSelectedEnc).toHaveBeenCalled();
  });
  it('handleChange should not call service.addSelectedEnc if selected enc"s are greater than MaxEncSelectionLimit' , () => {
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    expect(service.addSelectedEnc).not.toHaveBeenCalled();
  });
  it('syncEncsBetweenTables should set encList and selectedEncList' ,() => {
    jest.clearAllMocks();
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(3);
    expect(component.encList.length).toBe(5);
    service.getSelectedENCs.mockReturnValue(['AU210130']);
    component.syncEncsBetweenTables();
    expect(component.selectedEncList.length).toBe(1);
    expect(component.encList.length).toBe(5);
  });
  test('should show the content of paragraph in exchange set', () => {
    const fixture = TestBed.createComponent(EssUploadResultsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('Select up to 5 ENCs and Make an exchange set');
  });
  test('should show the error message when user select encs more than selection limit', () => {
    const fixture = TestBed.createComponent(EssUploadResultsComponent);
    fixture.detectChanges();
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    const dialog = fixture.debugElement.nativeElement.querySelector('ukho-dialogue');
    expect(dialog).not.toBeNull();
  });
});
