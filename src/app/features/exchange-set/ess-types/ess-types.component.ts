import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-types',
  templateUrl: './ess-types.component.html',
  styleUrls: ['./ess-types.component.scss'],
})
export class EssTypesComponent implements OnInit, OnDestroy {
  selectedOption: string | null = 'delta';
  baseOptionValue = 'base';
  deltaOptionValue = 'delta';
  isDeltaOption: boolean = true;
  isRadioSelected: boolean = true;
  isDateSelected: boolean = false;
  public selectedDeltaDownloadDate: Date;
  private _selectedDeltaDownloadDate: Date;
  isDateValid: boolean = true;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private essInfoErrorMessageService: EssInfoErrorMessageService,
    private essUploadFileService: EssUploadFileService
  ) {}

  ngOnInit(): void {
    this.onOptionChange(this.deltaOptionValue);
    this.triggerInfoErrorMessage(false,'info', '');
  }

  onOptionChange(option: string) {
    if (option === this.baseOptionValue) {
      this.selectedOption = option;
      this.isDeltaOption = false;
      this.isDateSelected = false;
      this.isRadioSelected = true;
      this.resetDate();
    } else if (option === this.deltaOptionValue) {
      this.selectedOption = option;
      this.isDeltaOption = true;
      this.isRadioSelected = false;
      this.isDateValid = true;
      this.essUploadFileService.exchangeSetDownloadType = 'Delta';
      this.checkProceedButtonState();
    }
  }

  onDateChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).valueAsDate;

    if (!selectedDate) {
      this.isDateSelected = false;
      this.isRadioSelected = false;
      this.isDateValid = false;
      return;
    }

    this.isDateSelected = true;

    if (this.isDeltaOption) {
      if (!this.isValidDeltaDateSelected(selectedDate)) {
        const errorMessage ='Date selected not within last 27 days, please choose a different date or select the “Download all data” option';
        this.isRadioSelected = false;
        this.isDateValid = false;
        this.triggerInfoErrorMessage(true, 'info', errorMessage);
        return;
      } else {
        // Clear the error message when a valid date is selected
        this.isDateValid = true;
        this.triggerInfoErrorMessage(false, 'info');
        const selectedDeltaDate = this._selectedDeltaDownloadDate;
        selectedDeltaDate.setHours(0, 0, 0, 0);
        this.essUploadFileService.exchangeSetDeltaDate = selectedDeltaDate;
      }
    }

    this.checkProceedButtonState();
  }

  onProceedClicked() {
    this.triggerInfoErrorMessage(false, 'info', '');
    this.router.navigate(['exchangesets', 'exchange-set']);
  }

  private isValidDeltaDateSelected(selectedDate: any) {
    const currentDate: any = new Date();
    const targetDate: any = new Date(selectedDate);
    targetDate.setHours(currentDate.getHours());
    targetDate.setMinutes(currentDate.getMinutes());
    targetDate.setSeconds(currentDate.getSeconds());
    targetDate.setMilliseconds(currentDate.getMilliseconds());
    
    const differenceMs = Math.abs(targetDate - currentDate);
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    if (differenceDays > 27 || targetDate > currentDate) {
      this.resetDate();
      return false;
    }
    this._selectedDeltaDownloadDate = targetDate;
    return true;
  }

  private resetDate() {
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    if (dateInput) {
      dateInput.value = '';
      this.isDateSelected = false;
    }
  }

  checkProceedButtonState() {
    if (this.selectedOption === this.baseOptionValue) {
      this.isRadioSelected = true;
    } else if (
      this.selectedOption === this.deltaOptionValue &&
      this.isDateSelected &&
      this.isDateValid // Only enable the button if the date is selected and valid
    ) {
      this.isRadioSelected = true;
    } else {
      this.isRadioSelected = false;
    }
    // Disable the proceed button if the date is invalid
    if (!this.isDateValid) {
      this.isRadioSelected = false;
    }
  }

  onRadioClick(option: string) {
    this.onOptionChange(option);
    this.triggerInfoErrorMessage(false, 'info', '');
    this.essUploadFileService.exchangeSetDeltaDate = undefined;
    this.essUploadFileService.exchangeSetDownloadType =
      option === 'base' ? 'Base' : 'Delta';
  }

  onDescriptionClick(option: string) {
    const radioOption =
      option === this.baseOptionValue ? 'baseRadio' : 'deltaRadio';
    const radioButton = this.elementRef.nativeElement.querySelector(
      `#${radioOption}`
    );
    radioButton.click();
  }

  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = '',
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc,
      
    };
  }

  ngOnDestroy(): void {
    this.triggerInfoErrorMessage(false, 'info', '');
  }
}
