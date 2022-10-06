import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InfoErrorMessage {
  showInfoErrorMessage: boolean;
  messageType: 'info' | 'warning' | 'success' | 'error';
  messageDesc: string;
}
@Injectable({
  providedIn: 'root',
})
export class EssInfoErrorMessageService {
  private infoErrorMessage: InfoErrorMessage = {
    showInfoErrorMessage: false,
    messageType: 'warning',
    messageDesc: 'test message',
  };
  private showInfoMessageSubject: BehaviorSubject<InfoErrorMessage> = new BehaviorSubject<InfoErrorMessage>(this.infoErrorMessage);

  get infoErrMessage(): InfoErrorMessage {
    return this.infoErrorMessage;
  }

  set showInfoErrorMessage(infoErrorMessage: InfoErrorMessage) {
    this.infoErrorMessage = infoErrorMessage;
    this.showInfoMessageBSubject.next(this.infoErrorMessage);
  }

  get showInfoMessageBSubject(): BehaviorSubject<InfoErrorMessage> {
    return this.showInfoMessageSubject;
  }
}
