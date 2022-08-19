import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEncDisplayComponent } from './single-enc-display.component';

describe('SingleEncDisplayComponent', () => {
  let component: SingleEncDisplayComponent;
  let fixture: ComponentFixture<SingleEncDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleEncDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEncDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
