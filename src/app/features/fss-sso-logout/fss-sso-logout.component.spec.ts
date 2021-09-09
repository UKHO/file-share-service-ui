import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssSsoLogoutComponent } from './fss-sso-logout.component';

describe('FssSsoLogoutComponent', () => {
  let component: FssSsoLogoutComponent;
  let fixture: ComponentFixture<FssSsoLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssSsoLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSsoLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
