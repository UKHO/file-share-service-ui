import {
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkFooterCell,
    CdkFooterCellDef,
    CdkHeaderCell,
    CdkHeaderCellDef,
  } from '@angular/cdk/table';
  import { Directive, HostBinding, Input } from '@angular/core';
  
  @Directive({
    selector: '[ukhoCellDef]',
    standalone: false,
    providers: [{ provide: CdkCellDef, useExisting: CellRefDirective }],
  })
  export class CellRefDirective extends CdkCellDef {}
  
  @Directive({
    selector: '[ukhoHeaderCellDef]',
    standalone: false,
    providers: [{ provide: CdkHeaderCellDef, useExisting: HeaderCellRefDirective }],
  })
  export class HeaderCellRefDirective extends CdkHeaderCellDef {}
  
  @Directive({
    selector: '[ukhoFooterCellDef]',
    standalone: false,
    providers: [{ provide: CdkFooterCellDef, useExisting: FooterCellRefDirective }],
  })
  export class FooterCellRefDirective extends CdkFooterCellDef {}
  
  @Directive({
    selector: '[ukhoColumnDef]',
    standalone: false,
    providers: [{ provide: CdkColumnDef, useExisting: ColumnDefDirective }],
  })
  export class ColumnDefDirective extends CdkColumnDef {
    /** Unique name for this column. */
    @Input('ukhoColumnDef')
    get name(): string {
      return this._name;
    }
    set name(name: string) {
      this._setNameInput(name);
    }
  }
  
  @Directive({
    selector: 'ukhoHeaderCell, th[ukhoHeaderCell]',
    standalone: false,
  })
  export class HeaderCellDirective extends CdkHeaderCell {
    @HostBinding('class') class = 'ukho-header-cell';
    @HostBinding('attr.role') role = 'columnheader';
  }
  
  @Directive({
    selector: 'ukhoFooterCell, td[ukhoFooterCell]',
    standalone: false,
  })
  export class FooterCellDirective extends CdkFooterCell {
    @HostBinding('class') class = 'ukho-footer-cell';
    @HostBinding('attr.role') role = 'gridcell';
  }
  
  @Directive({
    selector: 'ukhoCell, td[ukhoCell]',
    standalone: false,
  })
  export class CellDirective extends CdkCell {
    @HostBinding('class') class = 'ukho-cell';
    @HostBinding('attr.role') role = 'gridcell';
  }
