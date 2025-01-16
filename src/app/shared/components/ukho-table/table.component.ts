import { _VIEW_REPEATER_STRATEGY, _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { CdkTable, CDK_TABLE, CDK_TABLE_TEMPLATE, _COALESCED_STYLE_SCHEDULER, _CoalescedStyleScheduler } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ukho-table, table[ukho-table]',
  exportAs: 'ukhoTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['./table.component.scss'],
  providers: [
    {
      provide: CdkTable,
      useExisting: TableComponent
    },
    {
      provide: CDK_TABLE,
      useExisting: TableComponent
    },
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
    {
      provide: _COALESCED_STYLE_SCHEDULER,
      useClass: _CoalescedStyleScheduler
    }
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> extends CdkTable<T> {}
