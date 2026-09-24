import { _VIEW_REPEATER_STRATEGY, _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { CdkTable, CDK_TABLE } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ukho-table, table[ukho-table]',
  standalone: false,
  exportAs: 'ukhoTable',
  // Mirrors the template used internally by CdkTable (@angular/cdk/table) since v20 no longer exports CDK_TABLE_TEMPLATE.
  template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>
    @if (_isServer) {
      <ng-content/>
    }
    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
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
    }
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> extends CdkTable<T> {}
