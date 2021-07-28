import { FssSearchComponent } from './fss-search.component';
import { ButtonModule,SelectModule,CheckboxModule,TextinputModule,DialogueModule, ExpansionModule, CardModule, TableModule,PaginatorModule, TypeaheadModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FssSearchRoutingModule } from './fss-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FssSearchRowComponent } from './fss-search-row/fss-search-row.component';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchResultsComponent } from './fss-search-results/fss-search-results.component';
import { FilterPipe } from './filter.pipe';


@NgModule({
  declarations: [
    FssSearchComponent,
    FssSearchRowComponent,
    FssSearchResultsComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FssSearchRoutingModule,
    ButtonModule,SelectModule,CheckboxModule,TextinputModule,FormsModule, ReactiveFormsModule,DialogueModule,ExpansionModule,CardModule, TableModule,PaginatorModule, TypeaheadModule
  ],
  providers: [FileShareApiService]
})
export class FssSearchModule { }
