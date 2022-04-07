import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule, FilterModule } from '@ukho/design-system';
import { FilterGroup } from '@ukho/design-system/filter/filter.types';
import { FssSearchFilterService } from '../../src/app/core/services/fss-search-filter.service';
import { FssSimplifiedFilterComponent } from '../../src/app/features/fss-search/fss-simplified-search/fss-simplified-filter/fss-simplified-filter.component';

describe('FssSimplifiedFilterComponent', () => {
  let component: FssSimplifiedFilterComponent;
  let fixture: ComponentFixture<FssSimplifiedFilterComponent>;
  let applyFilterservice: FssSearchFilterService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,
        ButtonModule, FilterModule],
      declarations: [ FssSimplifiedFilterComponent ]
    })
    .compileComponents();
    applyFilterservice = TestBed.inject(FssSearchFilterService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssSimplifiedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit when the simplified apply filter button is clicked', () => {
    jest.spyOn(component.onApplyFilterButtonClicked, 'emit');
    component.onApplyFilterClick(ApplyFilterMockData)
    expect(component.onApplyFilterButtonClicked.emit).toHaveBeenCalled();
  });

  test('should return applyFilterExpression when the simplified apply filter button is clicked', () => {
    var expectedApplyfilterExpression = "($batch(Product) eq 'AVCS') AND (($batch(Media Type) eq 'DVD') OR ($batch(Media Type) eq 'CD'))";
    var applyFilterExpression = applyFilterservice.getFilterExpressionForApplyFilter(ApplyFilterMockData);
    expect(applyFilterExpression).toEqual(expectedApplyfilterExpression);
  });

});

const ApplyFilterMockData: FilterGroup[] = [
    {
      "title": 'Product',
      "items": [
        {
          "title": 'AVCS',
          "selected": true
        },
        {
          "title": 'ADP',
          "selected": false
        },
        {
          "title": 'eNP',
          "selected": false
        },
      ],
      "expanded": true
    },
    {
      "title": 'Media Type',
      "items": [
        {
          "title": 'DVD',
          "selected": true
        },
        {
          "title": 'CD',
          "selected": true
        },
        {
          "title": 'BASE',
          "selected": false
        },
        {
          "title": 'ZIP',
          "selected": false
        },
      ],
      "expanded": true
    },
    {
      "title": 'Week number',
      "items": [
        {
          "title": 'Week 39',
          "selected": false
        },
        {
          "title": 'Week 40',
          "selected": false
        },
        {
          "title": 'Week 41',
          "selected": false
        },
      ],
      "expanded": true
    },
    {
      "title": 'Year',
      "items": [
        {
          "title": '2022',
          "selected": false
        },
        {
          "title": '2021',
          "selected": false
        },
        {
          "title": '2020',
          "selected": false
        },
      ],
      "expanded": true
    }
  ]
