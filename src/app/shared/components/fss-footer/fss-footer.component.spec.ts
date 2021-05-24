import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssFooterComponent } from './fss-footer.component';

describe('FssFooterComponent', () => {
  let component: FssFooterComponent;
  let fixture: ComponentFixture<FssFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
