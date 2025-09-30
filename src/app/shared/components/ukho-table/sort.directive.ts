import { Directive, EventEmitter, Output } from '@angular/core';
import { SortHeaderDirective } from './sort-header.directive';
import { SortState } from './tables.types';

@Directive({
  selector: '[ukhoSort]',
  standalone: false,
})
export class SortDirective {
  @Output() readonly sortChange = new EventEmitter<SortState>();

  public headers = new Map<string, SortHeaderDirective>();

  public register(sortHeader: SortHeaderDirective) {
    this.headers.set(sortHeader.columnDef.name, sortHeader);
  }

  public deregister(sortHeader: SortHeaderDirective) {
    this.headers.delete(sortHeader.columnDef.name);
  }

  public onSort(state: { column: string; direction: 'asc' | 'desc' | '' }) {
    this.headers.forEach((header) => {
      if (header.columnDef.name !== state.column) {
        header.reset();
      }
    });
    this.sortChange.emit(state);
  }
}
