import {
    CdkFooterRow,
    CdkFooterRowDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CDK_ROW_TEMPLATE,
  } from '@angular/cdk/table';
  import { ChangeDetectionStrategy, Component, Directive, HostBinding, Input, ViewEncapsulation } from '@angular/core';
  
  @Directive({
    selector: '[ukhoHeaderRowDef]',
    providers: [{ provide: CdkHeaderRowDef, useExisting: HeaderRowDefDirective }],
    inputs: ['columns: ukhoHeaderRowDef'],
  })
  export class HeaderRowDefDirective extends CdkHeaderRowDef {}
  
  @Directive({
    selector: '[ukhoFooterRowDef]',
    providers: [{ provide: CdkFooterRowDef, useExisting: FooterRowDefDirective }],
    inputs: ['columns: ukhoFooterRowDef'],
  })
  export class FooterRowDefDirective extends CdkFooterRowDef {}
  
  @Directive({
    selector: '[ukhoRowDef]',
    providers: [{ provide: CdkRowDef, useExisting: RowDefDirective }],
    inputs: ['columns: ukhoRowDefColumns'],
  })
  export class RowDefDirective<T> extends CdkRowDef<T> {}
  
  @Component({
    selector: 'ukho-header-row, tr[ukho-header-row]',
    template: CDK_ROW_TEMPLATE,
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'ukhoHeaderRow',
    providers: [{ provide: CdkHeaderRow, useExisting: HeaderRowComponent }],
  })
  export class HeaderRowComponent extends CdkHeaderRow {
    @HostBinding('class') class = 'ukho-header-row';
    @HostBinding('attr.role') role = 'row';
  }
  
  @Component({
    selector: 'ukho-footer-row, tr[ukho-footer-row]',
    template: CDK_ROW_TEMPLATE,
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'ukhoFooterRow',
    providers: [{ provide: CdkFooterRow, useExisting: FooterRowComponent }],
  })
  export class FooterRowComponent extends CdkFooterRow {
    @HostBinding('class') class = 'ukho-footer-row';
    @HostBinding('attr.role') role = 'row';
  }
  
  @Component({
    selector: 'ukho-row, tr[ukho-row]',
    template: CDK_ROW_TEMPLATE,
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'matRow',
    providers: [{ provide: CdkRow, useExisting: RowComponent }],
  })
  export class RowComponent extends CdkRow {
    @HostBinding('class') class = 'ukho-row';
    @HostBinding('attr.role') role = 'row';
  }