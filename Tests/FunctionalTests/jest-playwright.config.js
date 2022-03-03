module.exports = {
    browsers: ["chromium"],
    //exitOnPageError: false, 
    // launchOptions: {
    //   headless: false,
    //   slowMo: 200
    // },
    contextOptions: {
      storageState: JSON.parse(process.env.STORAGE)
    },
    resetContextPerTest: true,
  }