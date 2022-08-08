import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogueModule, FileInputModule, RadioModule,ButtonModule ,CardModule, FileInputComponent, TextinputModule} from '@ukho/design-system';
import { EssAddSingleEncsComponent } from '../../src/app/features/exchange-set/ess-add-single-encs/ess-add-single-encs.component';

describe('EssAddSingleEncsComponent', () => {
  let component: EssAddSingleEncsComponent;
  let fixture: ComponentFixture<EssAddSingleEncsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,DialogueModule,FileInputModule,RadioModule,ButtonModule,CardModule,TextinputModule],
      declarations: [ EssAddSingleEncsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssAddSingleEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
