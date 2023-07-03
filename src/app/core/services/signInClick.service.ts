import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInClicked {
  private clickedState = new Subject<boolean>();
  currentstate = this.clickedState.asObservable();

  constructor() { }

  changeState(state: boolean) {
    this.clickedState.next(state)
  }

  click() {
    this.clickedState.next(true);
  }
}
