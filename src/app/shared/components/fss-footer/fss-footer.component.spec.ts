import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssFooterComponent } from './fss-footer.component';

describe('FssFooterComponent', () => {
  let component: FssFooterComponent;
  let fixture: ComponentFixture<FssFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,        
      ],
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

  it(`should have footer component'`, () => {    
    let compiled = fixture.nativeElement;
    let footer = compiled.querySelector('ukho-footer');
    expect(footer).not.toBeNull();    
  });
  
  it(`should have 2 navigation items`, () => {  
    const app = fixture.componentInstance;
    expect(app.navigation.length).toEqual(2);
    expect(app.navigation[0].title).toEqual("Privacy policy");
    expect(app.navigation[1].title).toEqual("Accessibility");
  });

});
