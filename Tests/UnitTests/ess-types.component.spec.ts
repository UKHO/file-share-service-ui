import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { EssTypesComponent } from '../../src/app/features/exchange-set/ess-types/ess-types.component';

describe('EssTypesComponent', () => {
  let component: EssTypesComponent;
  let fixture: ComponentFixture<EssTypesComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EssTypesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EssTypesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Delta Download" selected by default', () => {
    expect(component.selectedOption).toEqual('delta');
  });

  it('should update selected option on option change', () => {
    component.onOptionChange('base');
    expect(component.selectedOption).toEqual('base');
  });

  it('should navigate to "exchangesets/exchange-set" on proceed button click when both radio button and date are selected', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    component.onOptionChange('base');
    const event: any = { target: { valueAsDate: new Date() } };
    component.onDateChange(event);
    component.onProceedClicked();
    expect(routerSpy).toHaveBeenCalledWith(['exchangesets', 'exchange-set']);
  });

it('should navigate to "exchangesets/exchange-set" on Proceed button click when Base option is selected', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onOptionChange('base');
    component.onProceedClicked();
    expect(navigateSpy).toHaveBeenCalledWith(['exchangesets', 'exchange-set']);
  });

  it('should not navigate to "exchangesets/exchange-set" on proceed button click when either radio button or date is not selected', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    component.onOptionChange('delta');
    const event: any = { target: { valueAsDate: null} };
    component.onDateChange(event);
    component.onProceedClicked();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
