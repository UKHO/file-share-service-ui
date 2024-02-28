import { Time } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-exchange-set-type',
  templateUrl: './exchange-set-type.component.html',
  styleUrls: ['./exchange-set-type.component.scss']
})
export class ExchangeSetTypeComponent implements OnDestroy  {
  
  public radioDelta: string = 'Delta';
  public radioBase: string = 'Base';
  public rgExchageSetType: 'Base' | 'Delta';
  public selectedDeltaDownloadDate: Date;
  private _selectedDeltaDownloadDate: Date;

  constructor(private essInfoErrorMessageService: EssInfoErrorMessageService,
    private essUploadFileService: EssUploadFileService, private route: Router){}


  
  selectedExchangeSetType(type: 'Base' | 'Delta'){
    this.triggerInfoErrorMessage(false,'info', '');
    this.essUploadFileService.exchangeSetDeltaDate = undefined;
    this.essUploadFileService.exchangeSetDownloadType = type;
  }

  setExchangeSet(){
    if(!this.rgExchageSetType){
      this.triggerInfoErrorMessage(true,'error','','Select exchange set download type');
      return
    }

    if(this.rgExchageSetType === this.radioDelta){
      
      if(!this.selectedDeltaDownloadDate){
        this.triggerInfoErrorMessage(true,'error','','Select delta download date');
        return;
      } 
      
      if(this.selectedDeltaDownloadDate && !this.isValidDeltaDateSelected(this.selectedDeltaDownloadDate)){
        this.triggerInfoErrorMessage(true,'error','','Selected date must be less than or equal to 27 days');
        return;
      }

      this.triggerInfoErrorMessage(false , 'info','');
      const selectedDeltaDate = this._selectedDeltaDownloadDate;
      selectedDeltaDate.setHours(selectedDeltaDate.getHours() - 24);
      this.essUploadFileService.exchangeSetDeltaDate = selectedDeltaDate.toUTCString();
    }

    this.triggerInfoErrorMessage(false,'info', '');
    console.log(this.essUploadFileService.exchangeSetDeltaDate);
    this.route.navigate(['exchangesets', 'enc-upload']);
  }


  isValidDeltaDateSelected(selectedDate :any){
    const currentDate: any = new Date();
    const targetDate:any = new Date(selectedDate);
    targetDate.setHours(currentDate.getHours());
    targetDate.setMinutes(currentDate.getMinutes());
    targetDate.setSeconds(currentDate.getSeconds());
    targetDate.setMilliseconds(currentDate.getMilliseconds());
    console.table({'currentDate ' : currentDate  , 'targetDate' : targetDate});
    
    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(targetDate - currentDate);

    // Convert milliseconds to days
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    console.log('Difference in days:', differenceDays);

    if(differenceDays > 27){
      return false;
    }
    this._selectedDeltaDownloadDate = targetDate;
    return true;
  }

  // setDeltaDownloadDate(selectedDate: any){
  //   console.log(selectedDate);
  //   if(!this.isValidDeltaDateSelected(selectedDate)){
  //     this.triggerInfoErrorMessage(true,'error','','Selected date must be less than or equal to 27 days');
  //     return;
  //   }
  //   this.triggerInfoErrorMessage(false , 'info','');
  //   const selectedDeltaDate = this._selectedDeltaDownloadDate;
  //   selectedDeltaDate.setHours(selectedDeltaDate.getHours() - 24);
  //   this.essUploadFileService.exchangeSetDeltaDate = selectedDeltaDate.toUTCString();
  // }


  
  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = '',
    messageTitle?: string
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc,
      messageTitle
    };
  }

  ngOnDestroy(): void {
    this.triggerInfoErrorMessage(false , 'info','');
  }
}