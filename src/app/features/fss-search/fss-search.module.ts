import { FssSearchComponent } from './fss-search.component';
import { ButtonModule,SelectModule,CheckboxModule,TextinputModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FssSearchRoutingModule } from './fss-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FssSearchRowComponent } from './fss-search-row/fss-search-row.component';
import { HttpClientModule } from '@angular/common/http';
import { FssSearchResultService } from '../../core/services/fss-search-result.service';


@NgModule({
  declarations: [
    FssSearchComponent,
    FssSearchRowComponent
  ],
  imports: [
    CommonModule,
    FssSearchRoutingModule,
    ButtonModule,SelectModule,CheckboxModule,TextinputModule,FormsModule, ReactiveFormsModule
  ],
  providers:[FssSearchResultService]
})
export class FssSearchModule { }
