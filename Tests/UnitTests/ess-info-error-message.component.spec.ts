import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { DialogueModule } from '@ukho/design-system';
import { EssInfoErrorMessageService } from '../../src/app/core/services/ess-info-error-message.service';
describe('EssInfoErrorMessageComponent', () => {
  let component: EssInfoErrorMessageComponent;
  let fixture: ComponentFixture<EssInfoErrorMessageComponent>;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueModule],
      declarations: [ EssInfoErrorMessageComponent ],
      providers: [EssInfoErrorMessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssInfoErrorMessageComponent);
    component = fixture.componentInstance;
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
