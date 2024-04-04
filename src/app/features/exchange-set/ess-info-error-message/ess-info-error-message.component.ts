import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsNotInExchangeSet } from 'src/app/core/models/ess-response-types';
import { EssInfoErrorMessageService, InfoErrorMessage, RequestedProductsNotInExchangeSet } from '../../../core/services/ess-info-error-message.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-ess-info-error-message',
  templateUrl: './ess-info-error-message.component.html',
  styleUrls: ['./ess-info-error-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EssInfoErrorMessageComponent implements OnInit , OnDestroy {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageTitle: string | undefined;
  displayErrorMessage = false;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc: string | ProductsNotInExchangeSet[];
  essInfoErrorMessagesubscription: Subscription;
  constructor(private essInfoErrorMessageService: EssInfoErrorMessageService, private scroll : ViewportScroller ) {
  }

  ngOnInit(): void {
    this.essInfoErrorMessagesubscription = this.essInfoErrorMessageService.showInfoMessageBSubject.subscribe((showInfoMessage: InfoErrorMessage) => {
        let messageDesc = showInfoMessage.messageDesc;
        if(messageDesc && typeof showInfoMessage.messageDesc === 'object'){
          messageDesc = '';
          //messageDesc += '<h3 aria-live="polite" role="alert">'+showInfoMessage.messageTitle+'</h3>';
          for (const desc of showInfoMessage.messageDesc) {
            messageDesc += '<div class="warningMsg">'+desc.productName +' - '+ desc.reason +' </div>' ;
          }
        }else if(messageDesc){
          messageDesc = '<h3 aria-live="polite" role="alert" class="warningMsgTitle">'+messageDesc+'</h3>';
        }
        this.displayErrorMessage = showInfoMessage.showInfoErrorMessage;
        this.showMessage(showInfoMessage.messageType , messageDesc , showInfoMessage.messageTitle);
    });
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string | ProductsNotInExchangeSet[] = '',
    messageTitle?: string,
  ) {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.messageTitle = messageTitle;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
    if(messageDesc){
       this.scroll.scrollToPosition([0,0]);
    }
  }

  ngOnDestroy(): void {
   this.essInfoErrorMessagesubscription.unsubscribe();
  }
}
