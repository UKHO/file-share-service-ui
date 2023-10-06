export interface FilterGroup {
    title: string;
    items: FilterItem[];
    expanded?: boolean;
  }
  
  export interface FilterItem {
    title: string;
    selected?: boolean;
  }