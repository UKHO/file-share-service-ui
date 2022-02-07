import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { ButtonModule,TextinputModule, DialogueModule } from '@ukho/design-system';
import {jest} from '@jest/globals';
import { FssSimplifiedSearchComponent } from '../../src/app/features/fss-search/fss-simplified-search/fss-simplified-search.component';
import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';

describe('FssSimplifiedSearchComponent', () => {
  let component: FssSimplifiedSearchComponent;
  let fixture: ComponentFixture<FssSimplifiedSearchComponent>;
  let searchFilterservice: FssSearchFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        ButtonModule, TextinputModule, DialogueModule],
      declarations: [ FssSimplifiedSearchComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    searchFilterservice = TestBed.inject(FssSearchFilterService);
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
    var expectedfilterExpression = "$batchContains('AVCS') OR $batchContains('DVD') OR $batchContains('2022')";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS    DVD  2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

  test('should return filterExpression when the simplified search button is clicked with no extra blank space', () => {
    var expectedfilterExpression = "$batchContains('AVCS') OR $batchContains('DVD') OR $batchContains('2022')";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS DVD 2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

  test('should strip all single quotes from simplified search text', () => {
    var expectedfilterExpression = "$batchContains('AVCS') OR $batchContains('''DVD''') OR $batchContains('2022')";
    var filterExpression = searchFilterservice.getFilterExpressionForSimplifiedSearch("AVCS 'DVD' 2022");
    expect(filterExpression).toEqual(expectedfilterExpression);
  });

});
