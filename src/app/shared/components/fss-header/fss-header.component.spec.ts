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

  it('should have header component', () => {    
    let compiled = fixture.nativeElement;
    let header = compiled.querySelector('ukho-header');
    expect(header).not.toBeNull();    
  });

  it(`should have as title 'File Sharing Service'`, () => {  
    const app = fixture.componentInstance;
    expect(app.branding.title).toEqual('File Sharing Service');
  });

  it('should have 2 menu items', () => {  
    const app = fixture.componentInstance;
    expect(app.menuItems.length).toEqual(2);
    expect(app.menuItems[0].title).toEqual("Search");
    expect(app.menuItems[1].title).toEqual("Sign In");
  });

});
