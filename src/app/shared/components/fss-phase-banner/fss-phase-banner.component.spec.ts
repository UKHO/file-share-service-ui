import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssPhaseBannerComponent } from './fss-phase-banner.component';

describe('FssPhaseBannerComponent', () => {
  let component: FssPhaseBannerComponent;
  let fixture: ComponentFixture<FssPhaseBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,        
      ],
      declarations: [ FssPhaseBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssPhaseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have phase as 'alpha'`, () => {  
    const app = fixture.componentInstance;
    expect(app.phase).toEqual('alpha');
  });
});
