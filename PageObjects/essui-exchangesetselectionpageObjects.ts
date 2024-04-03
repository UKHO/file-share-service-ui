import { Page, Locator, expect } from "@playwright/test";

export class ExchangeSetSelectionPageObjects{
    readonly expect: ExchangeSetSelectionAssertion;
    readonly baseRadioButton: Locator;
    readonly deltaRadioButton: Locator;
    readonly datePicker: Locator;
    readonly proceed: Locator;
    readonly baseRadioButtonText: Locator;
    readonly baseDownloadDescription: Locator;
    readonly deltaRadioButtonText: Locator;
    readonly deltaDownloadDesription: Locator;
    readonly warningMessage: Locator;

    constructor(readonly page: Page) {
        this.expect = new ExchangeSetSelectionAssertion(this);
        this.baseRadioButton = page.locator("#baseRadio");
        this.deltaRadioButton = page.locator("#deltaRadio");
        this.datePicker = page.locator("input[type='date']");
        this.proceed = page.locator("button:has-text('Proceed')");
        this.baseRadioButtonText = page.locator("div[role='radiogroup'] > :nth-child(1) div label");
        this.baseDownloadDescription = page.locator("div[role='radiogroup'] > :nth-child(2)");
        this.deltaRadioButtonText = page.locator("div[role='radiogroup'] > :nth-child(4) div label");
        this.deltaDownloadDesription = page.locator("div[role='radiogroup'] > :nth-child(5)");
        this.warningMessage = page.locator(".warningMsgTitle");
    }

    async selectBaseDownloadRadioButton(){
        await this.baseRadioButton.click();
    }

    async selectDeltaDownloadRadioButton(){
        await this.deltaRadioButton.click();
    }

    async clickOnProceedButton(){
        await this.proceed.click();
    }

    async enterDate(date:Date){
        await this.datePicker.isEditable();
        let formattedDate: string = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
        await this.page.fill("[class='sc-admiralty-input']", formattedDate);
    }
}

export class ExchangeSetSelectionAssertion{
    constructor(readonly selection: ExchangeSetSelectionPageObjects) {
    }
    
    async validateProceedButton(){
        expect(await this.selection.proceed.isEnabled()).toBeFalsy();
    }

    async validateDatePicker(){
        expect(await this.selection.datePicker.isVisible()).toBeFalsy();
    }

    async validateDatePickerIsEmpty(){
        const date = await this.selection.datePicker.evaluate((element: HTMLInputElement) => element.value);
        expect(date == '').toBeTruthy();
    }

    async validateBaseRadioButtonText(){
        expect((await this.selection.baseRadioButtonText.innerText()).trim() =='Base Download').toBeTruthy();
    }

    async validateBaseDownloadDescription(){
        expect(await this.selection.baseDownloadDescription.innerText() =='Select Base Download for an exchange set that includes all data for selected ENCs.').toBeTruthy();
    }

    async validateDeltaRadioButtonText(){
        expect((await this.selection.deltaRadioButtonText.innerText()).trim() =='Delta Download').toBeTruthy();
    }

    async validateDeltaDownloadDescription(){
        expect(await this.selection.deltaDownloadDesription.innerText() =="Select Delta Download to receive updates from a specific date in the last 27 days for selected ENCs.").toBeTruthy();
    }

    async validateDefaultSelection(){
        const isSelected = await this.selection.deltaRadioButton.evaluate((element: HTMLInputElement) => element.checked);
        expect(isSelected).toBeTruthy();
    }

    async validateMessageForFutureDate(){
        await this.selection.warningMessage.click();
        expect(await this.selection.warningMessage.innerText() == 'Please choose a date from today or up to 27 days in the past. Future dates are not permitted.').toBeTruthy();
    }

    async validateMessageForPastDate(){   
        await this.selection.warningMessage.click();
        expect(await this.selection.warningMessage.innerText() == "Please select Base Download for duration greater than 27 days from today's date.").toBeTruthy();
    }
}