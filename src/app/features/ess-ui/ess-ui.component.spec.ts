import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUiComponent } from './ess-ui.component';

describe('EssUiComponent', () => {
  let component: EssUiComponent;
  let fixture: ComponentFixture<EssUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
