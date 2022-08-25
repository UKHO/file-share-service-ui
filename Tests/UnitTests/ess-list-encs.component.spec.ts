import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule,TextinputModule} from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { CommonModule } from '@angular/common';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let fixture: ComponentFixture<EssListEncsComponent>;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn().mockReturnValue([]),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
    getNotifySingleEnc : jest.fn().mockReturnValue(of(true))
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule, CheckboxModule,TextinputModule],
      declarations: [ EssListEncsComponent,
        EssAddSingleEncsComponent ],
      providers: [
        {
          provide : EssUploadFileService,
          useValue : service
        },
        {
          provide: Router,
          useValue: router
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
    fixture = TestBed.createComponent(EssListEncsComponent);
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
  
  test('should show the error message when user select encs more than selection limit', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    service.getSelectedENCs.mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU210140', 'AU220130' , 'AU220830']);
    component.handleChange('AU210470');
    const dialog = fixture.debugElement.nativeElement.querySelector('ukho-dialogue');
    expect(dialog).not.toBeNull();
  });

  it('should create EssListEncsComponent', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should render text inside an h1 tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Exchange sets');
  });

  test('should render text inside an p tag', () => {
    const fixture = TestBed.createComponent(EssListEncsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      `Select up to 5 ENCs and make an exchange set`
    );
  });

  test('getValidEncs should return enc', () => {
    let encList = service.getValidEncs();
    expect(encList.length).toEqual(5);
  });


});