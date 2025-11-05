import { Page, Locator, expect } from "@playwright/test";

export class ExchangeSetSelectionPageObjects {
    readonly expect: ExchangeSetSelectionAssertion;
    readonly baseRadioButton: Locator;
    readonly deltaRadioButton: Locator;
    readonly datePicker: Locator;
    readonly proceed: Locator;
    readonly warningMessage: Locator;
    readonly header: Locator;

    constructor(readonly page: Page) {
        this.expect = new ExchangeSetSelectionAssertion(this);
        this.baseRadioButton = page.locator("#baseRadio");
        this.deltaRadioButton = page.locator("#deltaRadio");
        this.datePicker = page.locator("input[type='date']");
        //this.proceed = page.locator("button:has-text('Proceed')");
        this.warningMessage = page.locator(".warningMsgTitle");
        this.header = page.locator("h2#main");
    }

    async selectBaseDownloadRadioButton() {
        await this.baseRadioButton.click();
    }

    async selectDeltaDownloadRadioButton() {
        await this.deltaRadioButton.click();
    }

  async clickOnProceedButton() {
    await this.page.getByTestId('StepProceedButton').click();
    }

    async enterDate(date: Date) {
        await this.datePicker.isEditable();
        let formattedDate: string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        await this.page.fill("[class='sc-admiralty-input']", formattedDate);
    }
}

export class ExchangeSetSelectionAssertion {
    constructor(readonly selection: ExchangeSetSelectionPageObjects) {
    }

    async validateProceedButton() {
        expect(await this.selection.proceed.isEnabled()).toBeFalsy();
    }

    async validateDatePicker() {
        expect(await this.selection.datePicker.isVisible()).toBeFalsy();
    }

    async validateDatePickerIsEmpty() {
        const date = await this.selection.datePicker.evaluate((element: HTMLInputElement) => element.value);
        expect(date == '').toBeTruthy();
    }

    //async validateBaseRadioButtonText() {
        //expect(((await this.selection.baseRadioButtonText.innerText())).split('\n')[0].trim() == 'Download all data').toBeTruthy();
       // expect(await this.selection.baseRadioButtonText.innerText() == 'Download all data').toBeTruthy();
   // }

    /*async validateBaseDownloadDescription() {
        expect((await this.selection.baseRadioButtonText.innerText()).split('\n')[1].trim() == 'Select Download all data if you are installing base and all updates for specific ENCs or ADMIRALTY Information Overlay (AIO).').toBeTruthy();
    }

    async validateDeltaRadioButtonText() {
        expect((await this.selection.deltaRadioButtonText.innerText()).split('\n')[0].trim() == 'Download updates').toBeTruthy();
    }

    async validateDeltaDownloadDescription() {
        expect((await this.selection.deltaRadioButtonText.innerText()).split('\n')[1].trim() == "Select Download updates to only receive updates for ENCs or AIO since your last update. This must be a date within the last 27 days.").toBeTruthy();
    }

    async validateDefaultSelection() {
        const isSelected = await this.selection.deltaRadioButton.evaluate((element: HTMLInputElement) => element.checked);
        expect(isSelected).toBeTruthy();
    }*/

    async validateMessageForFutureDate() {
        await this.selection.warningMessage.click();
        expect(await this.selection.warningMessage.innerText() == 'Date selected not within last 27 days, please choose a different date or select the “Download all data” option').toBeTruthy();
    }

    async validateMessageForPastDate() {
        await this.selection.warningMessage.click();
        expect(await this.selection.warningMessage.innerText() == 'Date selected not within last 27 days, please choose a different date or select the “Download all data” option').toBeTruthy();
    }

    async validateHeaderText(text: string) {
        expect((await this.selection.header.innerText()) == text).toBeTruthy();
    }
}
