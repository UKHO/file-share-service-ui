import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { ButtonModule,TextinputModule, DialogueModule } from '@ukho/design-system';
import {jest} from '@jest/globals';
import { FssSimplifiedSearchComponent } from '../../src/app/features/fss-search/fss-simplified-search/fss-simplified-search.component';

describe('FssSimplifiedSearchComponent', () => {
  let component: FssSimplifiedSearchComponent;
  let fixture: ComponentFixture<FssSimplifiedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        ButtonModule, TextinputModule, DialogueModule],
      declarations: [ FssSimplifiedSearchComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
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

});
