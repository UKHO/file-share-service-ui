import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FssHomeComponent } from './fss-home.component';

describe('FssHomeComponent', () => {
  let component: FssHomeComponent;
  let fixture: ComponentFixture<FssHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,        
      ],
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

  it(`should have as p text 'The ADMIRALTY File Sharing Service allows you to search and download files.'`, () => {
    let fixture = TestBed.createComponent(FssHomeComponent);
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('The ADMIRALTY File Sharing Service allows you to search and download files.');
  });

  it(`should have h2 as 'Sign in to access your files'`, () => {
    let fixture = TestBed.createComponent(FssHomeComponent);
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Sign in to access your files');
  });

  it('should have button component', () => {    
    let compiled = fixture.nativeElement;
    let button = compiled.querySelector('ukho-button');
    expect(button).not.toBeNull();
    expect(button.textContent).toEqual("Sign in");   
  });

  it('should have button component', () => {    
    let compiled = fixture.nativeElement;
    let a = compiled.querySelector('a');
    expect(a).not.toBeNull();
    expect(a.textContent).toEqual("Create a new account");   
  });

});
