import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { SortDirective } from './sort.directive';
import { SortHeaderDirective } from './sort-header.directive';
import {
  CellRefDirective,
  HeaderCellRefDirective,
  FooterCellRefDirective,
  ColumnDefDirective,
  CellDirective,
  FooterCellDirective,
  HeaderCellDirective,
} from './table.cells';
import {
  HeaderRowDefDirective,
  FooterRowDefDirective,
  RowDefDirective,
  FooterRowComponent,
  HeaderRowComponent,
  RowComponent,
} from './table.rows';

export { TableComponent } from './table.component';
export { SortDirective } from './sort.directive';
export { SortHeaderDirective } from './sort-header.directive';

const EXPORTED_DECLARATIONS = [
  // Table
  TableComponent,

  // Template defs
  CellRefDirective,
  HeaderCellRefDirective,
  FooterCellRefDirective,
  ColumnDefDirective,
  HeaderRowDefDirective,
  FooterRowDefDirective,
  RowDefDirective,

  // Cell directives
  HeaderCellDirective,
  FooterCellDirective,
  CellDirective,

  // Row directives
  HeaderRowComponent,
  FooterRowComponent,
  RowComponent,

  // Sort directives
  SortDirective,
  SortHeaderDirective,
];

@NgModule({
  declarations: [EXPORTED_DECLARATIONS],
  exports: [EXPORTED_DECLARATIONS],
  imports: [CommonModule, CdkTableModule],
})
export class TableModule { }
