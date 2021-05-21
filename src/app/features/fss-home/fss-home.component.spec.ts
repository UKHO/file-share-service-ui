import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssHomeComponent } from './fss-home.component';

describe('FssHomeComponent', () => {
  let component: FssHomeComponent;
  let fixture: ComponentFixture<FssHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
