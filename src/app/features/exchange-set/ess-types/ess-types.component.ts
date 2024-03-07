import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ess-types',
  templateUrl: './ess-types.component.html',
  styleUrls: ['./ess-types.component.scss']
})
export class EssTypesComponent implements OnInit {
  selectedOption: string | null = 'delta';
  isDeltaOption: boolean = true;
  isRadioSelected: boolean = true;
  isDateSelected: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.onOptionChange('delta');
  }

  onOptionChange(option: string) {
    this.selectedOption = option;
    this.isDeltaOption = option === 'delta';
    this.checkProceedButtonState();
  }

  onDateChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).valueAsDate;
    this.isDateSelected = selectedDate !== null;
    this.checkProceedButtonState();
  }

  onProceedClicked() {
    if (this.selectedOption === 'base' || (this.isDeltaOption && this.isDateSelected)) {
      this.router.navigate(['exchangesets', 'exchange-set']);
    } else {
      console.log('Please select a radio button and date before proceeding.');
    }
  }

  private checkProceedButtonState() {
    this.isRadioSelected = this.selectedOption === 'base' || (this.isDeltaOption && this.isDateSelected);
  }
}
