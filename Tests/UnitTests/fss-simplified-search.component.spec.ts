import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { ButtonModule,TextinputModule, DialogueModule } from '@ukho/design-system';
import {jest} from '@jest/globals';
import { FssSimplifiedSearchComponent } from '../../src/app/features/fss-search/fss-simplified-search/fss-simplified-search.component';
import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
describe('FssSimplifiedSearchComponent', () => {
  let component: FssSimplifiedSearchComponent;
  let fixture: ComponentFixture<FssSimplifiedSearchComponent>;
  let searchFilterservice: FssSearchFilterService;
  let route:Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,CommonModule,
        ButtonModule, TextinputModule, DialogueModule],
      declarations: [ FssSimplifiedSearchComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    searchFilterservice = TestBed.inject(FssSearchFilterService);
    route = TestBed.inject(Router);   
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FssSimplifiedSearchComponent', () => {
    const fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test('should emit when the simplified search button is clicked', () => {
    jest.spyOn(component.ShowAdvancedSearchClicked, 'emit');
    component.searchToSimplifiedSearch();
    expect(component.ShowAdvancedSearchClicked.emit).toHaveBeenCalled();
  });

  test('should show Advanced search Link', () => {
    const fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').textContent).toBe('Advanced Search');
  });

  test('should return filterExpression when the simplified search button is clicked with extra blank space', () => {
    var expectedfilterExpression = "(($batchContains('AVCS') OR $batchContains('DVD')) OR $batchContains('2022'))";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS    DVD  2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

  test('should return filterExpression when the simplified search button is clicked with no extra blank space', () => {
    var expectedfilterExpression = "(($batchContains('AVCS') OR $batchContains('DVD')) OR $batchContains('2022'))";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS DVD 2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

  test('should strip all single quotes from simplified search text', () => {
    var expectedfilterExpression = "(($batchContains('AVCS') OR $batchContains('''DVD''')) OR $batchContains('2022'))";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS 'DVD' 2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

  test('should show the content of exchange sets on search page', () => {
    const fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('You can make a small (100 ENC), custom exchange set here and download it');
  });

  test('should show the subtitle of exchange sets on search page', () => {
    const fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h4').textContent).toBe('Exchange sets');
  });

  test('should show Make an exchange set Link', () => {
    const fixture = TestBed.createComponent(FssSimplifiedSearchComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('switchToAdvanced switchToESS'))).toBeTruthy();
  });
 });
