import { InjectionToken, NgModule, APP_INITIALIZER } from '@angular/core';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppConfigService } from '../../../app/core/services/app-config.service';

const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

export function initializerFactory(env: AppConfigService, configUrl: string): any {
    const promise = env.init(configUrl).then((value) => {});
    return () => promise;
}

export function MSALInstanceFactory(config: AppConfigService): IPublicClientApplication {  
    const tenantName = AppConfigService.settings["b2cConfig"].tenantName;   
    return new PublicClientApplication({
    auth:{
      clientId: AppConfigService.settings["b2cConfig"].clientId,
      authority: "https://"+ tenantName +".b2clogin.com/"+ tenantName +".onmicrosoft.com/"+ AppConfigService.settings["b2cConfig"].signUpSignIn,
      redirectUri: AppConfigService.settings["b2cConfig"].redirectUri,
      knownAuthorities: [tenantName +".b2clogin.com/"],
      postLogoutRedirectUri: AppConfigService.settings["b2cConfig"].postLogoutRedirectUri,
      navigateToLoginRequestUrl: AppConfigService.settings["b2cConfig"].navigateToLoginRequestUrl      
    },
    cache:{
      cacheLocation: AppConfigService.settings["b2cConfig"].cacheLocation,
      storeAuthStateInCookie: AppConfigService.settings["b2cConfig"].storeAuthStateInCookie
    }
  });
}

export function MSALGuardConfigFactory(config: AppConfigService): MsalGuardConfiguration {
    return { 
      interactionType: AppConfigService.settings["b2cConfig"].interactionType
    };
}

@NgModule({
    providers: [],
    imports: [MsalModule]
})

export class MsalConfigDynamicModule {
    static forRoot(configFile: string) {
        return {
            ngModule: MsalConfigDynamicModule,
            providers: [
                AppConfigService,
                { provide: AUTH_CONFIG_URL_TOKEN, useValue: configFile },
                { provide: APP_INITIALIZER, useFactory: initializerFactory,
                     deps: [AppConfigService, AUTH_CONFIG_URL_TOKEN], multi: true },
                {
                    provide: MSAL_INSTANCE,
                    useFactory: MSALInstanceFactory,
                    deps: [AppConfigService]
                },
                {
                    provide: MSAL_GUARD_CONFIG,
                    useFactory: MSALGuardConfigFactory,
                    deps: [AppConfigService]
                },
                MsalGuard,
                MsalService,
                MsalBroadcastService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MsalInterceptor,
                    multi: true
                }
            ]
        };
    }
}