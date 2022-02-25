const playwrightGlobalSetup = require("jest-playwright-preset").globalSetup;
const { chromium } = require('playwright');
const { autoTestConfig } = require('./appSetting');
const LoginPortal = require( './helpermethod').LoginPortal;

module.exports = async function globalSetup(globalConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(autoTestConfig.url);
  await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);    

  // store authentication data
  const storage = await page.context().storageState();
  process.env.STORAGE = JSON.stringify(storage);

  await browser.close();
  await playwrightGlobalSetup(globalConfig);
};