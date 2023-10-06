export type SortDirection = 'asc' | 'desc' | '';

export interface SortState {
  column: string;
  direction: SortDirection;
}