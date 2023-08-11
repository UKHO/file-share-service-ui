import { CdkTable, CDK_TABLE_TEMPLATE } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ukho-table, table[ukho-table]',
  exportAs: 'ukhoTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: CdkTable, useExisting: TableComponent }],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> extends CdkTable<T> {}