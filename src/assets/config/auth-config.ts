import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

//const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1A_SignIn_SPA",
    editProfile: "B2C_1A_UserProfile"
  },
  authorities: {
    signUpSignIn: {
      authority: "https://mgiaidtestb2c.b2clogin.com/mgiaidtestb2c.onmicrosoft.com/B2C_1A_SignIn_SPA",
    },
    editProfile: {
      authority: "https://B2C_1A_SignIn_SPA.b2clogin.com/B2C_1A_SignIn_SPA.onmicrosoft.com/B2C_1A_UserProfile"
    }
  },
  authorityDomain: "B2C_1A_UserProfile.b2clogin.com"
};


export const msalConfig: Configuration = {
  auth: {
    clientId: 'd4ab354e-a3b2-480e-ad50-4e60f2ca0021',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: '/',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

//export const protectedResources = {
//  todoListApi: {
//    endpoint: "http://localhost:5000/api/todolist",
//    scopes: ["https://your-tenant-name.onmicrosoft.com/api/tasks.read"],
//  },
//}
//export const loginRequest = {
//  scopes: []
//};
