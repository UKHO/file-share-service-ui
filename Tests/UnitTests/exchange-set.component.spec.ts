import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeSetComponent } from '../../src/app/features/exchange-set/exchange-set.component';
import {RadioComponent} from '@ukho/design-system'
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA,DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ExchangeSetComponent', () => {
  let component: ExchangeSetComponent;
  let fixture: ComponentFixture<ExchangeSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ExchangeSetComponent,RadioComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create exchange set component', () => {
    expect(component).toBeTruthy();
  });

  test('should have 2 radio button in exchange set component', () => {
    const fixture = TestBed.createComponent(ExchangeSetComponent);
    const radio = fixture.debugElement.nativeElement.querySelector('ukho-radio');
    expect(radio).not.toBeNull();
  });

  test('should return 2 radio buttons value in exchange set', () => {
    component = new ExchangeSetComponent();
    component.ngOnInit();
    expect(component.radioUploadEncValue).toEqual("UploadEncFile");
    expect(component.radioAddEncValue).toEqual("AddSingleEnc");
  });

  test('should show the content of paragraph in exchange set', () => {
    const fixture = TestBed.createComponent(ExchangeSetComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('Update your ENCs for a vessel and make an exchange set');
  });

  it('should display addUploadEncComponents div when radioUploadEnc is checked ', () => {
    let rgAddUploadENCOption: DebugElement[] = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    let addUploadEncOption: HTMLInputElement = rgAddUploadENCOption[0].nativeElement;
    addUploadEncOption.checked = true;
    expect(fixture.debugElement.queryAll(By.css('uploadENCFileSection'))).toBeTruthy();
  });

  it('should display addSingleFileSection div when radioAddEnc is checked ', () => {
    let rgAddUploadENCOption: DebugElement[] = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    let addSingleFileSectionOption: HTMLInputElement = rgAddUploadENCOption[1].nativeElement;
    addSingleFileSectionOption.checked = true;
    expect(fixture.debugElement.queryAll(By.css('addSingleFileSection'))).toBeTruthy();
  });
  
});

