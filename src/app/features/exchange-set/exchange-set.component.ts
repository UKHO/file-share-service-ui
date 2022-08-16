import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../app/core/services/app-config.service'

@Component({
  selector: 'app-exchange-set',
  templateUrl: './exchange-set.component.html',
  styleUrls: ['./exchange-set.component.scss'],
})

export class ExchangeSetComponent implements OnInit {
  rgAddUploadENC: string;  
  radioUploadEncValue:string;
  radioAddEncValue:string;
  maxEncSelectionLimit:any;
  constructor() {
    this.maxEncSelectionLimit = AppConfigService.settings['essConfig'].MaxEncSelectionLimit;
   }
   
  ngOnInit(): void {
    this.radioUploadEncValue="UploadEncFile";
    this.radioAddEncValue="AddSingleEnc";
  }

}
