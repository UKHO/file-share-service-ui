import { Component, OnInit } from '@angular/core';
import { EssInfoErrorMessageService } from '../../../app/core/services/ess-info-error-message.service';
import { AppConfigService } from '../../../app/core/services/app-config.service';

@Component({
  selector: 'app-exchange-set',
  templateUrl: './exchange-set.component.html',
  styleUrls: ['./exchange-set.component.scss'],
})

export class ExchangeSetComponent implements OnInit {
  rgAddUploadENC: string;
  radioUploadEncValue: string;
  radioAddEncValue: string;
  maxEncSelectionLimit: number;
  addSingleEncRenderFrom ='essHome';
  addSingleEncBtnText = 'Proceed';

  constructor(private essInfoErrorMessageService: EssInfoErrorMessageService) {
    this.maxEncSelectionLimit = AppConfigService.settings['essConfig'].MaxEncSelectionLimit;
   }

  ngOnInit(): void {
    this.radioUploadEncValue = 'UploadEncFile';
    this.radioAddEncValue = 'AddSingleEnc';
    this.triggerInfoErrorMessage(false,'info', '');
  }

  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc,
    };
  }

}
