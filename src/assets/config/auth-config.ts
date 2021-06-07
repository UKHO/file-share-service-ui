
import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

//const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1A_SignIn_SPA",
        editProfile: "B2C_1A_UserProfile"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://mgiaiddevb2c.b2clogin.com/mgiaiddevb2c.onmicrosoft.com/B2C_1A_SignIn_SPA",
        },
        // editProfile: {
        //     authority: "'https://mgiaiddevb2c.b2clogin.com/mgiaiddevb2c.onmicrosoft.com/B2C_1_email_signup_signin_default',"
        // }
    },
    authorityDomain: "mgiaiddevb2c.b2clogin.com"
};

export const msalConfig: Configuration = {
    auth: {
        clientId: '4aa5dabc-bf54-44e8-8926-d3e3ea172422',
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: 'https://jwt.ms',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    }
}

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
// export const silentRequest = {
//     scopes: ["openid", "profile"],
//     loginHint: "example@domain.net"
// };