import { FssSearchComponent } from './fss-search.component';
import { ButtonModule,SelectModule,CheckboxModule,TextinputModule,DialogueModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FssSearchRoutingModule } from './fss-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FssSearchRowComponent } from './fss-search-row/fss-search-row.component';
import { FileShareApiService } from '../../core/services/file-share-api.service';
import { FssSearchResultsComponent } from './fss-search-results/fss-search-results.component';
import { FilterOperatorPipe } from './fss-search-pipes/filterOperator/filter-operator.pipe';


@NgModule({
  declarations: [
    FssSearchComponent,
    FssSearchRowComponent,
    FssSearchResultsComponent,
    FilterOperatorPipe
  ],
  imports: [
    CommonModule,
    FssSearchRoutingModule,
    ButtonModule,SelectModule,CheckboxModule,TextinputModule,FormsModule, ReactiveFormsModule,DialogueModule
  ],
  providers: [FileShareApiService]
})
export class FssSearchModule { }
