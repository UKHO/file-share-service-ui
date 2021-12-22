import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModule, DialogueModule, FileInputModule } from '@ukho/design-system';
import { EssUiRoutingModule } from '../../src/app/features/ess-ui/ess-ui-routing.module';

import { EssUiComponent } from '../../src/app/features/ess-ui/ess-ui.component';

describe('EssUiComponent', () => {
  let component: EssUiComponent;
  let fixture: ComponentFixture<EssUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        EssUiRoutingModule,
        FileInputModule, CardModule, DialogueModule ],
      declarations: [EssUiComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EssUiComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should return Given file type is not supported. Please upload file in CSV format', () => {
    component = new EssUiComponent();
    component.ngOnInit();
    var testfile = sampleCsvData();
    component.isValidCSVFile(testfile);
  });
});

    const SampleCSV = `ENC Data

    US2FAS01

    DE2NO000

    US4FL44M

    US456630

    `;
    export function sampleCsvData() {

      return new File([SampleCSV], "sample.csv", { type: 'text/csv' });

    }
