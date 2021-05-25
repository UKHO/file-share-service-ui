import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssHeaderComponent } from './fss-header.component';

describe('FssHeaderComponent', () => {
  let component: FssHeaderComponent;
  let fixture: ComponentFixture<FssHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,        
      ],
      declarations: [ FssHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have header component'`, () => {    
    let compiled = fixture.nativeElement;
    let header = compiled.querySelector('ukho-header');
    expect(header).not.toBeNull();    
  });
});
