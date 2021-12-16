import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUiParseComponent } from './ess-ui-parse.component';

describe('EssUiParseComponent', () => {
  let component: EssUiParseComponent;
  let fixture: ComponentFixture<EssUiParseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssUiParseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUiParseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
