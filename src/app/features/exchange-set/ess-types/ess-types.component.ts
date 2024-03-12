import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
 selector: 'app-ess-types',
 templateUrl: './ess-types.component.html',
 styleUrls: ['./ess-types.component.scss']
})
export class EssTypesComponent implements OnInit {
 selectedOption: string | null = 'delta';
 baseOptionValue = 'base';
 deltaOptionValue = 'delta';
 isDeltaOption: boolean = true;
 isRadioSelected: boolean = true;
 isDateSelected: boolean = false;

 constructor(private elementRef: ElementRef, private router: Router) {}

 ngOnInit(): void {
    this.onOptionChange('delta');
 }

 onOptionChange(option: string) {
  if (option === this.baseOptionValue) {
    this.selectedOption = option;
    this.isDeltaOption = false;
    this.checkProceedButtonState();
  } else if (option === this.deltaOptionValue) {
    this.selectedOption = option;
    this.isDeltaOption = true;
    this.isRadioSelected = false;
  }
}
 onDateChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).valueAsDate;
    this.isDateSelected = selectedDate !== null;
    this.checkProceedButtonState();
 }

 onProceedClicked() {
    if (this.selectedOption === this.baseOptionValue || (this.isDeltaOption && this.isDateSelected)) {
      this.router.navigate(['exchangesets', 'exchange-set']);
    } else {
      console.log('Please select a radio button and date before proceeding.');
    }
 }

 private checkProceedButtonState() {
    if (this.selectedOption === this.baseOptionValue) {
      this.isRadioSelected = true;
    } else if (this.selectedOption === this.deltaOptionValue && this.isDateSelected) {
      this.isRadioSelected = true;
    } else {
      this.isRadioSelected = false;
    }
 }

 onRadioClick(option: string) {
    this.onOptionChange(option);
 }

 onDescriptionClick(option: string) {
    const radioOption = option === this.baseOptionValue ? 'baseRadio' : 'deltaRadio';
    const radioButton = this.elementRef.nativeElement.querySelector(`#${radioOption}`);
    radioButton.click(); 
 }
}