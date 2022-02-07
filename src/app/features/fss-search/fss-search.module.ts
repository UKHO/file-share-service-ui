import { FssSearchComponent } from './fss-search.component';
import { ButtonModule,SelectModule,CheckboxModule,TextinputModule,DialogueModule, ExpansionModule, CardModule, TableModule,PaginatorModule, TypeaheadModule, HorizontalRuleModule, FilterModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FssSearchRoutingModule } from './fss-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FssSearchRowComponent } from './fss-search-row/fss-search-row.component';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchResultsComponent } from './fss-search-results/fss-search-results.component';
import { FilterPipe } from './filter.pipe';
import { FssPopularSearchBatchesComponent } from './fss-popular-search-batches/fss-popular-search-batches.component';
import { FssAdvancedSearchComponent } from './fss-advanced-search/fss-advanced-search.component';
import { FssSimplifiedSearchComponent } from './fss-simplified-search/fss-simplified-search.component';
import { FssSimplifiedFilterComponent } from './fss-simplified-search/fss-simplified-filter/fss-simplified-filter.component';


@NgModule({
  declarations: [
    FssSearchComponent,
    FssSearchRowComponent,
    FilterPipe,
    FssSearchResultsComponent,
    FssPopularSearchBatchesComponent,
    FssAdvancedSearchComponent,
    FssSimplifiedSearchComponent,
    FssSimplifiedFilterComponent
  ],
  imports: [
    CommonModule,
    FssSearchRoutingModule,
    ButtonModule,SelectModule,CheckboxModule,TextinputModule,FormsModule,ReactiveFormsModule,DialogueModule,ExpansionModule,CardModule, TableModule,PaginatorModule, TypeaheadModule, HorizontalRuleModule, FilterModule
  ],
  providers: [FileShareApiService]
})
export class FssSearchModule { }
