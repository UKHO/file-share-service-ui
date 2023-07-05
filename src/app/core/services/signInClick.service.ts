import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInClicked {
  private clickedState: Subject<boolean>;
  currentstate: Observable<boolean>;
  constructor() {
    this.clickedState = new Subject<boolean>()
    this.currentstate = this.clickedState.asObservable();
  }

  changeState(state: boolean) {
    this.clickedState.next(state)
  }

  click() {
    this.clickedState.next(true);
  }
}
