import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSearchComponent } from './fss-search.component';

describe('FssSearchComponent', () => {
  let component: FssSearchComponent;
  let fixture: ComponentFixture<FssSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
