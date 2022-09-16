import { Page, Locator, expect } from "@playwright/test";
import { EssLandingPageObjects } from "./essui-landingpageObjects";


export class EncSelectionPageObjects {

    esslandingPageObjects: EssLandingPageObjects;
    readonly expect: EncSelectionPageAssertions;
    readonly encNameSelector: Locator;
    readonly startLinkSelector: Locator;
    readonly textAboveTableSelector: Locator;
    readonly textAboveTable: Locator;
    readonly rightTableSelector: Locator;
    readonly rightTableEncPositionSeletor: Locator;
    readonly firstCheckBoxSelector: Locator;
    readonly XButtonSelector: Locator;
    readonly addAnotherENCSelector: Locator;
    readonly typeENCTextBoxSelector: Locator;
    readonly addENCButtonSelector: Locator;
    readonly startAgainLinkSelector: Locator;
    readonly EncSelectorAt101th: Locator;
    readonly maxLimitEncmessageSelector: Locator;
    readonly maxLimitEncmessage: Locator;
    readonly firstEncSelector: Locator;
    readonly secondEncSelector: Locator;
    readonly leftTableRowsCountSelector: Locator;
    readonly errorMessageForDuplicateNumberSelector: Locator;
    readonly errorMsgDuplicateENC: Locator;
    readonly anotherCheckBoxSelector: Locator;
    readonly chooseBoxSelecetor: Locator;
    readonly errorMsgMaxLimitSelector: Locator;
    readonly errorMsgMaxLimit: Locator;
    readonly ENCTableENClistCol1: Locator;
    readonly ENCTableCheckboxlist: Locator;
    readonly uploadradiobtnSelector: Locator;
    readonly addencradiobtnSelector: Locator;
    readonly selectionTextSelector: Locator;
    readonly addSingleENCTextboxSelector: Locator

    constructor(readonly page: Page) {
        this.expect = new EncSelectionPageAssertions(this);
        this.esslandingPageObjects = new EssLandingPageObjects(page);
        this.encNameSelector = this.page.locator("text=ENC name");
        this.startLinkSelector = this.page.locator(".linkStartAgain");
        this.textAboveTableSelector = this.page.locator("text=Select up to 100 ENCs and make an exchange set");
        this.rightTableSelector = this.page.locator("//div/div[2]/div[3]/div[1]/table/tbody/tr");
        this.rightTableEncPositionSeletor = this.page.locator("//div/div[2]/div[3]/div[1]/table/tbody/tr[1]/td[1]");
        this.firstCheckBoxSelector = this.page.locator("//div/table/tbody/tr[1]/td[2]/ukho-checkbox/input");
        this.XButtonSelector = this.page.locator("//table/tbody/tr/td[2]/button/i");
        this.addAnotherENCSelector = this.page.locator("a.lnkAddAnotherEnc");
        this.typeENCTextBoxSelector = this.page.locator("//input[@placeholder='Type ENC cell name here']");
        this.addENCButtonSelector = this.page.locator("//button[text()=' Add ENC ']");
        this.startAgainLinkSelector = this.page.locator("a.linkStartAgain");
        this.EncSelectorAt101th = this.page.locator("//div/table/tbody/tr[101]/td[2]");
        this.maxLimitEncmessageSelector = this.page.locator("//h3[text()='No more than 100 ENCs can be selected.']");
        this.errorMessageForDuplicateNumberSelector = this.page.locator("//h3[text()='ENC already in list.']");
        this.chooseBoxSelecetor = this.page.locator("input[id = 'ukho-form-field-5']");
        this.errorMsgMaxLimitSelector = this.page.locator("//ukho-dialogue");
        this.selectionTextSelector = this.page.locator("//p[text()='Your selection ']");
        this.ENCTableENClistCol1 = this.page.locator('//table/tbody/tr/td[1]');
        this.ENCTableCheckboxlist = this.page.locator('//table/tbody/tr/td[2]/ukho-checkbox/input');
        
    }

    async addSingleENC(data: string): Promise<void> {
        await this.esslandingPageObjects.addencradiobtnSelector.click();
        await this.esslandingPageObjects.addSingleENCTextboxSelector.fill(data);
        await this.esslandingPageObjects.proceedButtonSelectorClick();
    }

    async addAnotherENC(data: string): Promise<void> {
        await this.addAnotherENCSelector.click();
        await this.typeENCTextBoxSelector.fill(data);
        await this.esslandingPageObjects.addsingleencSelector.click();
    }

    async addAnotherENCSelectorClick(): Promise<void> {
        await this.addAnotherENCSelector.click();
    }

    async addENCButtonSelectorClick(): Promise<void> {
        await this.addENCButtonSelector.click();
    }

    async startAgainLinkSelectorClick(): Promise<void> {
        await this.startAgainLinkSelector.click();
    }

    async setTypeENCTextBoxSelector(data: string): Promise<void> {
        await this.typeENCTextBoxSelector.fill(data);
    }

    async encNameSelectorClick(): Promise<void> {
        await this.encNameSelector.click();
    }

    async EncSelectorAt101thClick(): Promise<void> {
        await this.EncSelectorAt101th.click();
    }

    async addMaxLimitENCs(): Promise<void> {

        for (var i = 0; i < 10; i++) {
            await this.setTypeENCTextBoxSelector("AU21010" + i);
            await this.addENCButtonSelectorClick();
        }

        for (var i = 10; i < 100; i++) {
            await this.setTypeENCTextBoxSelector("CA2101" + i);
            await this.addENCButtonSelectorClick();
        }

        for (var i = 100; i < 250; i++) {
            await this.setTypeENCTextBoxSelector("CN210" + i);
            await this.addENCButtonSelectorClick();
        }
    }

}

class EncSelectionPageAssertions {
    constructor(readonly encSelectionPageObjects: EncSelectionPageObjects) {
    }

    async verifySelectedENCs(expectedENCs: string[]): Promise<void> {

        const selectENCsFromTable = this.encSelectionPageObjects.ENCTableCheckboxlist;
        const selectedENCsInRightTable = this.encSelectionPageObjects.rightTableSelector;

        if (expectedENCs.length) {
            for (var i = 0; i < expectedENCs.length; i++) {

                await selectENCsFromTable.nth(i).click();

                expect(await selectedENCsInRightTable.nth(i).innerText()).toEqual(expectedENCs[i]);
            }

        }

    }

    async verifyDeselectedENCs(expectedENCs: string[]): Promise<void> {

        const selectENCsFromTable = this.encSelectionPageObjects.ENCTableCheckboxlist;
        const selectedENCsInRightTable = this.encSelectionPageObjects.rightTableSelector;

        if (expectedENCs.length) {
            for (var i = 0; i < expectedENCs.length; i++) {

                await selectENCsFromTable.nth(i).click();
            }

            expect(await selectedENCsInRightTable.count()).toEqual(0);

        }
    }

    async verifyRightTableRowsCountSelectorCount(selectCount: any): Promise<void> {

        const selectENCsFromTable = this.encSelectionPageObjects.ENCTableCheckboxlist;
        const selectedENCsInRightTable = this.encSelectionPageObjects.rightTableSelector;

        if (selectCount) {
            for (var i = 0; i < selectCount; i++) {

                await selectENCsFromTable.nth(i).click();

            }

            expect(await selectedENCsInRightTable.count()).toEqual(selectCount);

        }

    }

    async verifyXButtonSelectorClick(): Promise<void> {

        await this.encSelectionPageObjects.firstCheckBoxSelector.click();
        await this.encSelectionPageObjects.XButtonSelector.click();

        await expect(this.encSelectionPageObjects.firstCheckBoxSelector).not.toBeChecked();
        await expect(this.encSelectionPageObjects.XButtonSelector).toBeHidden();
    }

    async verifyENCsSortOrder(expectedENCs: string[]): Promise<void> {

        const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

        expect(uploadedEncs.length).toEqual(expectedENCs.length);

        for (var i = 0; i < expectedENCs.length; i++) {

            expect(uploadedEncs[i]).toEqual(expectedENCs[i]);
        }
    }


    async errorMsgMaxLimitSelectorContainText(expected: string): Promise<void> {

        expect(await this.encSelectionPageObjects.errorMsgMaxLimitSelector.innerText()).toEqual(expected);
    }

    async maxLimitEncmessageSelectorContainText(expected: string): Promise<void> {

        expect(await this.encSelectionPageObjects.maxLimitEncmessageSelector.innerText()).toEqual(expected);
    }

    async addAnotherENCSelectorVisible(): Promise<void> {

        expect(this.encSelectionPageObjects.addAnotherENCSelector).toBeVisible();
    }

    async selectionTextSelectorVisible(): Promise<void> {

        expect(await this.encSelectionPageObjects.selectionTextSelector).toBeVisible();
    }


    async errorMessageForDuplicateNumberSelectorContainsText(expected: string): Promise<void> {

        expect(await this.encSelectionPageObjects.errorMessageForDuplicateNumberSelector.innerText()).toEqual(expected);
    }

    async anotherCheckBoxSelectorChecked(): Promise<void> {

        const selectENCsFromTable = this.encSelectionPageObjects.ENCTableCheckboxlist;

        expect(await selectENCsFromTable.nth(1).isChecked()).toBeFalsy();
    }

    async verifyLeftTableRowsCountSelectorCount(expectedCount: any): Promise<void> {

        expect(await this.encSelectionPageObjects.ENCTableENClistCol1.count()).toEqual(expectedCount)
    }

    async firstEncSelectorToEqual(expected: string): Promise<void> {
        const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

        expect(uploadedEncs[0]).toEqual(expected);
    }

    async secondEncSelectorContainText(expected: string): Promise<void> {
        const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

        expect(uploadedEncs[1]).toEqual(expected);
    }

    async startLinkSelectorVisible(): Promise<void> {

        expect(this.encSelectionPageObjects.startLinkSelector.isVisible).toBeTruthy();
    }

    async textAboveTableSelectorToEqual(expected: string): Promise<void> {

        expect(await this.encSelectionPageObjects.textAboveTableSelector.innerText()).toEqual(expected);
    }

}

