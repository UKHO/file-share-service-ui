import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { ButtonModule,TextinputModule, DialogueModule, CheckboxModule, TableModule } from '@ukho/design-system';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';

describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let fixture: ComponentFixture<EssListEncsComponent>;
  let service = {
    getValidEncs : jest.fn().mockReturnValue(['AU5SYD01'])
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        ButtonModule, TextinputModule, DialogueModule, CheckboxModule, TableModule],
      providers: [
        {
          provide: EssUploadFileService,
          useValue: service
        }
      ],
      declarations: [ EssListEncsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssListEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(compiled.querySelector('p').textContent).toContain('Select up to 100 ENCs and Make an exchange set');
  });

  test('getValidEncs should return enc', () => {
    let encList = service.getValidEncs();
    expect(encList.length).toEqual(1);
  });

});
