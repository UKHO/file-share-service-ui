import { Page, Locator, expect } from "@playwright/test";
import { assert } from "console";
import {essConfig} from '../src/assets/config/appconfig.json';

export class EssLandingPageObjects {
    readonly expect: EssLandingPageAssertions;
    readonly radioButtonNameSelector: Locator;
    readonly exchangesettextSelector: Locator;
    readonly uploadbtntextSelector: Locator;
    readonly addenctextSelector: Locator;
    readonly uploadradiobtnSelector: Locator;
    readonly addencradiobtnSelector: Locator;
    readonly chooseuploadfileoptionSelector: Locator;
    readonly chooseuploadfileproceedSelector: Locator;
    readonly addsingleencSelector: Locator;
    readonly proceedButtonSelector: Locator;
    readonly errorMessageSelector: Locator;
    readonly errorMessageExcludeENCsSelector: Locator;
    readonly txtFileNameWithExtension: Locator;
    readonly chooseuploadfileSelector: Locator;
    readonly errorMessageForInvalidENCSelector: Locator;
    readonly selectionTextSelector: Locator;
    readonly startAgainLinkSelector: Locator;
    readonly addSingleENCTextboxSelector: Locator;
    readonly ENClistTableCol1: Locator;
    readonly MaxENCValue:Locator;
    readonly MaxSelectedENCs:Locator;

    constructor(readonly page: Page) {
        this.expect = new EssLandingPageAssertions(this);
        this.radioButtonNameSelector = this.page.locator("//label[text()='Upload a list in a file']");
        this.exchangesettextSelector = this.page.locator("h1#main");
        this.uploadbtntextSelector = this.page.locator("#radioUploadEnc");
        this.addenctextSelector = this.page.locator("#radioAddEnc");
        this.uploadradiobtnSelector = this.page.locator("//input[@value='UploadEncFile']");
        this.addencradiobtnSelector = this.page.locator("//input[@value='AddSingleEnc']");
        this.chooseuploadfileoptionSelector = this.page.locator("#file-upload");
        this.chooseuploadfileproceedSelector = this.page.locator("ukho-button.UploadButton");
        this.addsingleencSelector = this.page.locator("button[type='submit']");
        this.proceedButtonSelector = this.page.locator("//button[@type='submit']");
        this.errorMessageSelector = this.page.locator("section:has-text('Please select a .csv or .txt file')");
        this.errorMessageExcludeENCsSelector = this.page.locator("//ukho-dialogue/section");
        this.txtFileNameWithExtension = this.page.locator("ValidAndInvalidENCs");
        this.chooseuploadfileSelector = this.page.locator("span.instructions.ng-star-inserted");
        this.errorMessageForInvalidENCSelector = this.page.locator("section:has-text('Invalid ENC number')");
        this.selectionTextSelector = this.page.locator("body > app-root:nth-child(1) > div:nth-child(4) > app-ess-list-encs:nth-child(2) > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > h3:nth-child(1)");
        this.startAgainLinkSelector = this.page.locator("a.linkStartAgain");
        this.addSingleENCTextboxSelector = this.page.locator("//input[@placeholder='Type ENC cell name here']");
        this.ENClistTableCol1 = this.page.locator('//table/tbody/tr/td[1]');
        this.MaxENCValue = this.page.locator("//p[contains(text(),'You can upload')]");
        this.MaxSelectedENCs = this.page.locator('//div/div/div/p[3]');
    }

    async uploadFile(page: Page, filePath: string): Promise<void> {

        const [fileChooserDataFile] = await Promise.all([
            page.waitForEvent('filechooser'),
            await this.chooseuploadfileSelector.click(),
        ]);
        await fileChooserDataFile.setFiles(filePath);
    }


    async DragDropFile(page: Page, filePath: string, fileName: string, fileType: string): Promise<void> {
        const fs = require('fs');

        const dataTransfer = await page.evaluateHandle(

            async ({ fileHex, localFileName, localFileType }) => {
                const dataTransfer = new DataTransfer();

                dataTransfer.items.add(
                    new File([fileHex], localFileName, { type: localFileType })
                );

                return dataTransfer;
            },

            {
                fileHex: (await fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })),
                localFileName: fileName,
                localFileType: fileType,
            }

        );

        await page.dispatchEvent("#file-upload", "drop", { dataTransfer });
    }


    async uploadradiobtnSelectorClick(): Promise<void> {
        await this.uploadradiobtnSelector.click();
    }

    async addencradiobtnSelectorClick(): Promise<void> {
        await this.addencradiobtnSelector.click();
    }

    async proceedButtonSelectorClick(): Promise<void> {
        await this.proceedButtonSelector.click();
    }

    async setaddSingleENCTextboxSelector(data: string): Promise<void> {
        await this.addSingleENCTextboxSelector.fill(data);
    }

}

class EssLandingPageAssertions {
    constructor(readonly esslandingPageObjects: EssLandingPageObjects) {
    }

    async verifyUploadedENCs(expectedENCs: string[]): Promise<void> {

        let uploadedEncs = await this.esslandingPageObjects.ENClistTableCol1.allInnerTexts();

        expect(uploadedEncs.length).toEqual(expectedENCs.length);

        for (var i = 0; i < expectedENCs.length; i++) {

            expect(uploadedEncs[i]).toEqual(expectedENCs[i]);

        }
    }

    async exchangesettextSelectorIsVisible(): Promise<void> {

        expect(await this.esslandingPageObjects.exchangesettextSelector).toBeVisible;
    }

    async chooseuploadfileoptionSelectorIsVisible(): Promise<void> {

        expect(await this.esslandingPageObjects.chooseuploadfileoptionSelector).toBeVisible;
    }

    async chooseuploadfileproceedSelectorIsVisible(): Promise<void> {

        expect(await this.esslandingPageObjects.chooseuploadfileproceedSelector).toBeVisible;
    }

    async addsingleencSelectorIsVisible(): Promise<void> {

        expect(await this.esslandingPageObjects.addsingleencSelector).toBeVisible;
    }

    async proceedButtonSelectorIsVisible(): Promise<void> {

        expect(this.esslandingPageObjects.proceedButtonSelector).toBeVisible;
    }

    async uploadbtntextSelectorContainText(expected: string): Promise<void> {
        expect(await this.esslandingPageObjects.uploadbtntextSelector.innerText()).toEqual(expected);
    }

    async addenctextSelectorContainText(expected: string): Promise<void> {

        expect(await this.esslandingPageObjects.addenctextSelector.innerText()).toEqual(expected);
    }

    async errorMessageSelectorContainText(expected: string): Promise<void> {

        expect(await this.esslandingPageObjects.errorMessageSelector.innerText()).toEqual(expected);
    }

    async errorMessageForInvalidENCSelectorContainText(expected: string): Promise<void> {

        expect(await this.esslandingPageObjects.errorMessageForInvalidENCSelector.innerText()).toEqual(expected);
    }

    async VerifyExcludedENCsMessage(expected: string): Promise<void> {

        expect(await this.esslandingPageObjects.errorMessageExcludeENCsSelector.innerText()).toContain(expected);
    }

    async uploadedDataSelectorToBeEqual(expected: string): Promise<void> {

        const uploadedEncs = await this.esslandingPageObjects.ENClistTableCol1.allInnerTexts();
        expect(uploadedEncs[0]).toEqual(expected);
    }

    async verifyUploadRadioButtonName(expected: string): Promise<void> {
        expect(await this.esslandingPageObjects.radioButtonNameSelector.innerText()).toEqual(expected);
    }
    async verifyDraggedFile(expected: string): Promise<void> {
        expect(await this.esslandingPageObjects.chooseuploadfileoptionSelector.innerText()).toContain(expected);
    }

    async VerifyMaxENCLimit(): Promise<void> {
        let MaxLimit = ((await (this.esslandingPageObjects.MaxENCValue).innerText()).split(' '))[12];
        expect(MaxLimit).toEqual(essConfig.MaxEncLimit)
    }


    async VerifyMaxSelectedENCLimit(): Promise<void> {
        let MaxSelectedLimit = ((await (this.esslandingPageObjects.MaxSelectedENCs).innerText()).split(' '))[17];
        expect(MaxSelectedLimit).toEqual(essConfig.MaxEncSelectionLimit);
    }
}