import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchMenuState {
      public SelectedOption : string;
}

 @Injectable({
  providedIn: 'root'
})
export class SearchTypeChanged {
  private searchTypeStateChange: Subject<boolean>;
  currentstate: Observable<boolean>;
  constructor() {
    this.searchTypeStateChange = new Subject<boolean>()
    this.currentstate = this.searchTypeStateChange.asObservable();
  }

  changeState(state: boolean) {
    this.searchTypeStateChange.next(state)
  }

  click() {
    this.searchTypeStateChange.next(true);
  }
} 

