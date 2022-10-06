import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EssInfoErrorMessageService, InfoErrorMessage } from 'src/app/core/services/ess-info-error-message.service';

@Component({
  selector: 'app-ess-info-error-message',
  templateUrl: './ess-info-error-message.component.html',
  styleUrls: ['./ess-info-error-message.component.scss'],
})
export class EssInfoErrorMessageComponent implements OnInit {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageTitle = '';
  displayErrorMessage = true;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = 'Test Error Message';
  constructor(private essInfoErrorMessageService: EssInfoErrorMessageService) {
  }

  ngOnInit(): void {
    this.essInfoErrorMessageService.showInfoMessageBSubject.subscribe((showInfoMessage: InfoErrorMessage) => {
        console.log(showInfoMessage);
        this.messageType = showInfoMessage.messageType;
        this.displayErrorMessage = showInfoMessage.showInfoErrorMessage;
        this.messageDesc = showInfoMessage.messageDesc;
    });
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageTitle: string = '',
    messageDesc: string = ''
  ) {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }
}
