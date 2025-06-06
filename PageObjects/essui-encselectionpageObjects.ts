import { Page, Locator, expect } from "@playwright/test";
import { EssLandingPageObjects } from "./essui-landingpageObjects";
import { autoTestConfig } from "../appSetting.json"
export var SelectedENCs: number;


export class EncSelectionPageObjects {

  esslandingPageObjects: EssLandingPageObjects;
  readonly expect: EncSelectionPageAssertions;
  readonly encNameSelector: Locator;
  readonly startLinkSelector: Locator;
  readonly textAboveTableSelector: Locator;
  readonly textAboveTable: Locator;
  readonly firstCheckBoxSelector: Locator;
  readonly XButtonSelector: Locator;
  readonly addAnotherENCSelector: Locator;
  readonly typeENCTextBoxSelector: Locator;
  readonly addENCButtonSelector: Locator;
  readonly startAgainLinkSelector: Locator;
  readonly EncSelectorAt250th: Locator;
  readonly maxLimitEncmessage: Locator;
  readonly secondEncSelector: Locator;
  readonly leftTableDisplaySelector: Locator;
  readonly rightTableDisplaySelector: Locator;
  readonly errorMsgDuplicateENC: Locator;
  readonly chooseBoxSelecetor: Locator;
  readonly errorMsgMaxLimit: Locator;
  readonly ENCTableENClistCol1: Locator;
  readonly encTableCheckboxList: Locator;
  readonly encTableButtonList: Locator;
  readonly uploadradiobtnSelector: Locator;
  readonly addencradiobtnSelector: Locator;
  readonly selectionTextSelector: Locator;
  readonly addSingleENCTextboxSelector: Locator
  readonly selectAllSelector: Locator
  readonly deselectAllSelector: Locator
  readonly exchangeSetSizeSelector: Locator
  readonly requestENCsSelector: Locator
  readonly encTableListCountDisplay: Locator
  readonly getDialogueSelector : Locator
  readonly errorMessage : Locator
  readonly encNames : Locator
  readonly messageBackground: Locator;
  readonly s63Radiobutton : Locator
  readonly s57Radiobutton : Locator
  readonly selectedEncs : Locator
  readonly pageUnderTest: Page


  constructor(readonly page: Page) {
    this.expect = new EncSelectionPageAssertions(this);
    this.esslandingPageObjects = new EssLandingPageObjects(page);
    this.encNameSelector = this.page.locator("text=ENC name"); 
    this.startLinkSelector = this.page.locator(".linkStartAgain"); 
    this.textAboveTableSelector = this.page.locator("div.showConfirmEssMessage"); 
    
    this.XButtonSelector = this.page.locator("//table/tbody/tr/td[2]/button/i"); 
    this.addAnotherENCSelector = this.page.locator("a.lnkAddAnotherEnc"); 
    this.typeENCTextBoxSelector = this.page.locator("//input[@placeholder='Type ENC cell name here']");
    this.addENCButtonSelector = this.page.locator("//button[text()=' Add ENC ']");
    this.startAgainLinkSelector = this.page.locator("a.linkStartAgain");
    this.EncSelectorAt250th = this.page.locator("//div/table/tbody/tr[250]/td[2]"); 
    this.chooseBoxSelecetor = this.page.locator("input[id = 'ukho-form-field-5']");
    this.selectionTextSelector = this.page.locator("text='Your selection '");
    this.exchangeSetSizeSelector = this.page.locator('span.bottomText')
    this.ENCTableENClistCol1 = this.page.locator('(//table/tbody)[1]/tr/td[1]'); 
    this.selectAllSelector = this.page.locator("a[class='selectDeselctBtn']")
    this.deselectAllSelector = this.page.locator("//a[text()=' Deselect all ']")

    this.firstCheckBoxSelector = this.page.getByRole('row').filter({ has: this.page.getByRole("checkbox") }).getByRole('checkbox').first();
    this.encTableButtonList = this.page.getByRole('row').filter({ has: this.page.getByRole("button") });
    this.encTableCheckboxList = this.page.locator("input[type='checkbox']");
    this.encTableListCountDisplay = this.page.locator("span[class='showListEncTotal']");
    this.leftTableDisplaySelector = this.page.locator("span[class='showListEncTotal']").nth(0)
    this.rightTableDisplaySelector = this.page.locator("span[class='showListEncTotal']").nth(1)
    this.requestENCsSelector = page.getByRole('button', { name: 'Request ENCs' })
    this.getDialogueSelector = this.page.locator(("admiralty-dialogue"));
    this.errorMessage = this.page.locator("h3[class='warningMsgTitle']");
    this.encNames = this.page.locator("table[class='cdk-table enc-list-table'] tbody tr td");
    this.messageBackground = this.page.locator("admiralty-dialogue[class='sc-admiralty-dialogue-h sc-admiralty-dialogue-s hydrated'] section");
    this.s57Radiobutton = this.page.locator("input[value = 'S57'] + label");
    this.s63Radiobutton = this.page.locator("input[value = 'S63'] + label");
    this.selectedEncs = this.page.locator("table:nth-child(1) > tbody:nth-child(2)");
    this.pageUnderTest = page;
  }

  async addSingleENC(data: string): Promise<void> {
    await this.esslandingPageObjects.addencradiobtnSelector.click();
    await this.esslandingPageObjects.addSingleENCTextboxSelector.fill(data);
    await this.esslandingPageObjects.proceedButtonSelectorClick();
  }

  async addAnotherENC(data: string): Promise<void> {
    await this.page.waitForSelector("a.lnkAddAnotherEnc", {state:'visible', timeout: 5000});
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
    await this.page.waitForSelector("a.linkStartAgain", { state:'visible', timeout: 3000 });
    await this.startAgainLinkSelector.click();
  }

  async setTypeENCTextBoxSelector(data: string): Promise<void> {
    await this.typeENCTextBoxSelector.fill(data);
  }

  async encNameSelectorClick(): Promise<void> {
    await this.encNameSelector.click();
  }

  async EncSelectorAt250thClick(): Promise<void> {
    await this.EncSelectorAt250th.click();
  }

  async firstCheckBoxSelectorClick(): Promise<void> {
    await this.firstCheckBoxSelector.click();

  }

  async selectAllSelectorClick(): Promise<void> {
    await this.page.waitForSelector("a[class='selectDeselctBtn']", { state: 'visible', timeout: 3000});
    await this.selectAllSelector.click();

  }

  async deselectAllSelectorClick(): Promise<void> {

    await this.deselectAllSelector.click();

  }
  async requestENCsSelectorClick(): Promise<void> {
    await this.requestENCsSelector.click();
  }

  async SelectedENCsCount(): Promise<void> {
    SelectedENCs = parseInt(((await this.rightTableDisplaySelector.innerHTML()).split(' '))[1])
  }

  async getFileSize(response: string){
    var responseBody = JSON.parse(response);      
    let numberOfENCs = await responseBody.products.length;
    let fileSize = 0;
    for (var i = 0; i < numberOfENCs; i++) 
      fileSize += responseBody.products[i].fileSize;
    return parseFloat(((fileSize/1048576)+0.5).toFixed(2));
  }

  async getFileSizeItemRemoved(response: string, idx: number){
    
    var responseBody = JSON.parse(response);      
    let revisedList = responseBody.products.splice(idx,1);
    let numberOfENCs = await responseBody.products.length;
    let fileSize = 0;
    for (var i = 0; i < numberOfENCs; i++) 
      fileSize += responseBody.products[i].fileSize;
    return ((fileSize/1048576)+0.5).toFixed(2);
  }

  async getFileSizeForDelta(response: string, encNames: string[]){
    var responseBody = JSON.parse(response);  
    let numberOfENCs = await responseBody.products.length;
    let fileSize = 0;
    for (var i = 0; i < numberOfENCs; i++){
      if(encNames.includes(responseBody.products[i].productName))
        fileSize += responseBody.products[i].fileSize;
    }
    return parseFloat(((fileSize/1048576)+0.5).toFixed(2));
  }

  async getCommonEncs(productIdentifier: string, sinceDateResponse: string){
    var productIdentifierResponse = JSON.parse(productIdentifier);  
    let numberOfENCs = await productIdentifierResponse.products.length;
    let encNames: string[] = [];
    for (var i = 0; i < numberOfENCs; i++){
      if(sinceDateResponse.includes(productIdentifierResponse.products[i].productName))
        encNames.push(productIdentifierResponse.products[i].productName);
  }
    return encNames;
  }
}

class EncSelectionPageAssertions {
  constructor(readonly encSelectionPageObjects: EncSelectionPageObjects) {
  }

  async verifySelectedENCs(expectedENCs: string[]): Promise<void> {

    const testPage = this.encSelectionPageObjects.pageUnderTest;

    if (expectedENCs.length) {
      for (var i = 0; i < expectedENCs.length; i++) {

        await testPage.getByLabel(expectedENCs[i]).getByRole("checkbox").first().check();
        const matchItem = testPage.getByTestId(expectedENCs[i])

        expect(matchItem).toBeTruthy();
      }

    }

  }

  async verifyDeselectedENCs(expectedENCs: string[]): Promise<void> {

    const selectedENCsTableCountDisplay = this.encSelectionPageObjects.encTableListCountDisplay;
    const testPage = this.encSelectionPageObjects.pageUnderTest;

    if (expectedENCs.length) {
      for (var i = 0; i < expectedENCs.length; i++) {

        await testPage.getByLabel(expectedENCs[i]).getByRole("checkbox").first().uncheck();

      }

      expect(await selectedENCsTableCountDisplay.nth(1).innerHTML()).toContain("0");

    }
  }

  async verifyRightTableRowsCountSelectorCount(selectCount: any): Promise<void> {
    const testPage = this.encSelectionPageObjects.pageUnderTest;

    if (selectCount) {
      for (var i = 0; i < selectCount; i++) {
        
        await testPage.getByRole('row').filter({ has: testPage.getByRole("checkbox") }).getByLabel('', { exact: true }).nth(i).check();

      }

      const total = await testPage.getByRole('row').filter({ has: testPage.getByRole("button") }).count();

      expect(total).toEqual(selectCount);

    }

  }

  async verifyXButtonSelectorClick(testId: string): Promise<void> {
    const testPage = this.encSelectionPageObjects.pageUnderTest;
    const admiraltyCheckbox = testPage.getByLabel(testId).getByRole("checkbox").first();
    await admiraltyCheckbox.click();
    //now click the "X" on the left
    await testPage.getByTestId(testId).click();
    await expect(admiraltyCheckbox).not.toBeChecked();
    await expect(testPage.getByTestId(testId)).toBeHidden();
  }


  async verifyENCsSortOrder(expectedENCs: string[]): Promise<void> {

    const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

    expect(uploadedEncs.length).toEqual(expectedENCs.length);

    for (var i = 0; i < expectedENCs.length; i++) {

      expect(uploadedEncs[i]).toEqual(expectedENCs[i]);

    }
  }

  async errorMsgMaxLimitSelectorContainText(expected: string): Promise<void> {
    expect(this.encSelectionPageObjects.getDialogueSelector).toBeTruthy();
    expect(await this.encSelectionPageObjects.errorMessage.innerText() == expected).toBeTruthy();
  }

  async maxLimitEncmessageSelectorContainText(expected: string): Promise<void> {

    expect(await this.encSelectionPageObjects.getDialogueSelector.innerText()).toEqual(expected);
  }

  async addAnotherENCSelectorVisible(): Promise<void> {

    expect(this.encSelectionPageObjects.addAnotherENCSelector).toBeVisible();
  }

  async selectionTextSelectorVisible(): Promise<void> {

    expect(this.encSelectionPageObjects.selectionTextSelector).toBeVisible();
  }

  async errorMessageForDuplicateNumberSelectorContainsText(expected: string): Promise<void> {
    expect(this.encSelectionPageObjects.getDialogueSelector).toBeTruthy();
    await this.encSelectionPageObjects.errorMessage.click();
    expect(await this.encSelectionPageObjects.errorMessage.innerText() == expected).toBeTruthy();
  }

  async anotherCheckBoxSelectorChecked(): Promise<void> {

    await expect(this.encSelectionPageObjects.firstCheckBoxSelector).not.toBeChecked();
  }

  async verifyLeftTableRowsCountSelectorCount(expectedCount: any): Promise<void> {

    expect(await this.encSelectionPageObjects.ENCTableENClistCol1.count()).toEqual(expectedCount)
  }

  async firstEncSelectorToEqual(expected: string): Promise<void> {
    await this.encSelectionPageObjects.page.waitForTimeout(1000);
    const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

    expect(uploadedEncs[0]).toEqual(expected);
  }

  async secondEncSelectorContainText(expected: string): Promise<void> {
    await this.encSelectionPageObjects.page.waitForSelector('table tbody tr:nth-child(2) td', { state: 'visible' });
    const uploadedEncs = await this.encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();

    expect(uploadedEncs[1]).toEqual(expected);
  }

  async startLinkSelectorVisible(): Promise<void> {

    expect(this.encSelectionPageObjects.startLinkSelector.isVisible).toBeTruthy();
  }

  async textAboveTableSelectorToEqual(expected: string): Promise<void> {

    expect((await this.encSelectionPageObjects.textAboveTableSelector.innerText()).trim()==(expected));
  }

  async verifyNumberofENCs(): Promise<void> {
    let rightTableRowsCount = await this.encSelectionPageObjects.encTableButtonList.count(); 
    let leftTableRowsCount = await this.encSelectionPageObjects.encTableCheckboxList.count();     
    expect(leftTableRowsCount).toEqual(rightTableRowsCount);
    expect(await this.encSelectionPageObjects.leftTableDisplaySelector.innerText()).toEqual("Showing " + leftTableRowsCount + " ENCs");
    expect(await this.encSelectionPageObjects.rightTableDisplaySelector.innerText()).toEqual("" + rightTableRowsCount + " ENCs selected");
  }

  async verifySizeofENCs(expected: any): Promise<void> {
    const testPage = this.encSelectionPageObjects.pageUnderTest;
    let rightTableRowsCount = await testPage.getByRole('row').filter({ has: testPage.getByRole("button") }).count();

    if (rightTableRowsCount < 1) {
      expect(await this.encSelectionPageObjects.exchangeSetSizeSelector.innerText()).toEqual("" + '0MB');

    }
    else   //autoTestConfig.encSizeConfig
      expect(await this.encSelectionPageObjects.exchangeSetSizeSelector.innerText()).toEqual("" + ((rightTableRowsCount * (0.3)) + Number.parseFloat(autoTestConfig.encSizeConfig)).toFixed(1) + 'MB');

  }

  async selectAllSelectorIsVisible(): Promise<void> {

    expect(this.encSelectionPageObjects.selectAllSelector.isVisible).toBeTruthy();

  }

  async deselectAllSelectorVisible(): Promise<void> {

    expect(this.encSelectionPageObjects.deselectAllSelector.isVisible).toBeTruthy();

  }

  async verifyRequestPayload(expectedENCs: string[], selectedEncs: string[]): Promise<void> {

    expect(selectedEncs.length).toEqual(expectedENCs.length);

    for (var i = 0; i < expectedENCs.length; i++) {

      expect(selectedEncs[i]).toEqual(expectedENCs[i]);

    }
  }

  async toBeTruthy(result: Boolean): Promise<void> {
    expect(result).toBeTruthy();
  }

  async ValidateProductVersionPayload(sinceDate: string, productVersion: string | null) {
    var result: boolean;
    var sinceDateResponse = JSON.parse(sinceDate);
    var productVersionBody = JSON.parse(productVersion ?? "");
    for (let i = 0; i < productVersionBody.length; i++) {
      var product = sinceDateResponse.products.find(r => r.productName == productVersionBody[i].productName);
      result = product.updateNumbers[0] == 0 ?
      productVersionBody[i].editionNumber == product.editionNumber - 1 && productVersionBody[i].updateNumber == 0 :
      productVersionBody[i].updateNumber == product.updateNumbers[0] - 1 && productVersionBody[i].editionNumber == product.editionNumber;
      expect(result).toBeTruthy();
    }
  }

}
