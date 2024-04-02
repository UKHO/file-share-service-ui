import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeSetComponent } from '../../src/app/features/exchange-set/ess-input-types/exchange-set.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA,DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';

describe('ExchangeSetComponent', () => {
  let component: ExchangeSetComponent;
  let fixture: ComponentFixture<ExchangeSetComponent>;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  let essUploadFileService: EssUploadFileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ExchangeSetComponent,EssInfoErrorMessageComponent ],
      providers:[EssInfoErrorMessageService, EssUploadFileService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };

    fixture = TestBed.createComponent(ExchangeSetComponent);
    component = fixture.componentInstance;
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    essUploadFileService = TestBed.inject(EssUploadFileService);
    fixture.detectChanges();
  });

  it('should create exchange set component', () => {
    expect(component).toBeTruthy();
  });

  test('should return 2 radio buttons value in exchange set', () => {
    component.ngOnInit();
    expect(component.radioUploadEncValue).toEqual("UploadEncFile");
    expect(component.radioAddEncValue).toEqual("AddSingleEnc");
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(essInfoErrorMessageService.infoErrMessage).toStrictEqual(errObj);
    
  });

  test('should show the sub heading in exchange set', () => {
    const fixture = TestBed.createComponent(ExchangeSetComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('Update your ENCs for a vessel by making an exchange set');
  });

  it('should display addUploadEncComponents div when radioUploadEnc is checked ', () => {
    let rgAddUploadENCOption: DebugElement[] = fixture.debugElement.queryAll(By.css('admiralty-radio'));
    let addUploadEncOption: HTMLInputElement = rgAddUploadENCOption[0].nativeElement;
    addUploadEncOption.checked = true;
    expect(fixture.debugElement.queryAll(By.css('uploadENCFileSection'))).toBeTruthy();
  });

  it('should display addSingleFileSection div when radioAddEnc is checked ', () => {
    let rgAddUploadENCOption: DebugElement[] = fixture.debugElement.queryAll(By.css('admiralty-radio'));
    let addSingleFileSectionOption: HTMLInputElement = rgAddUploadENCOption[1].nativeElement;
    addSingleFileSectionOption.checked = true;
    expect(fixture.debugElement.queryAll(By.css('addSingleFileSection'))).toBeTruthy();
  });
  
  test('should show the content of paragraph in exchange set with selection limit from config', () => {
    const fixture = TestBed.createComponent(ExchangeSetComponent);
    fixture.detectChanges();
    const essLandingPageText = fixture.debugElement.queryAll(By.css('p'));
    for (var i = 0; i < essLandingPageText.length; i++) {
      if(i == essLandingPageText.length-1)
      expect(essLandingPageText[i].nativeElement.innerHTML).toBe('You can add a single ENC or upload a list.');
    }
  });
});
