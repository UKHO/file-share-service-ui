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

    constructor(readonly page: Page) {
        this.expect = new ExchangeSetSelectionAssertion(this);
        this.baseRadioButton = page.locator("#baseRadio");
        this.deltaRadioButton = page.locator("#deltaRadio");
        this.datePicker = page.locator("input[type='Date']");
        this.proceed = page.locator("button[type='submit']");
        this.baseRadioButtonText = page.locator("div[role='radiogroup'] > :nth-child(1) div label");
        this.baseDownloadDescription = page.locator("div[role='radiogroup'] > :nth-child(2)");
        this.deltaRadioButtonText = page.locator("div[role='radiogroup'] > :nth-child(4) div label");
        this.deltaDownloadDesription = page.locator("div[role='radiogroup'] > :nth-child(5)");
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
        await this.datePicker.click();
        let formattedDate: string = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
        await this.datePicker.type(formattedDate);
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
        expect(await this.selection.baseRadioButtonText.innerText() =='Base Download').toBeTruthy();
    }

    async validateBaseDownloadDescription(){
        expect(await this.selection.baseDownloadDescription.innerText() =='Select Base Download for a full download file from base data.').toBeTruthy();
    }

    async validateDeltaRadioButtonText(){
        expect(await this.selection.deltaRadioButtonText.innerText() =='Delta Download').toBeTruthy();
    }

    async validateDeltaDownloadDescription(){
        expect(await this.selection.deltaDownloadDesription.innerText() =="Select Delta Download for updates required prior to 27 days from today's date.").toBeTruthy();
    }

    async validateDefaultSelection(){
        const isSelected = await this.selection.deltaRadioButton.evaluate((element: HTMLInputElement) => element.checked);
        expect(isSelected).toBeTruthy();
    }
}