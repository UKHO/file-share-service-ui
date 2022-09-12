import { InjectionToken, NgModule, APP_INITIALIZER } from '@angular/core';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppConfigService } from '../../../app/core/services/app-config.service';
import { HttpErrorInterceptorService } from '../../core/services/httperror-interceptor.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

export function initializerFactory(env: AppConfigService, configUrl: string): any {
    const promise = env.init(configUrl).then((value) => { });
    return () => promise;
}

export function MSALInstanceFactory(config: AppConfigService): IPublicClientApplication {
    const tenantName = AppConfigService.settings["b2cConfig"].tenantName;
    return new PublicClientApplication({
        auth: {
            clientId: AppConfigService.settings["b2cConfig"].clientId,
            authority: "https://" + tenantName + ".b2clogin.com/" + tenantName + ".onmicrosoft.com/" + AppConfigService.settings["b2cConfig"].signUpSignIn,
            redirectUri: AppConfigService.settings["b2cConfig"].redirectUri,
            knownAuthorities: [tenantName + ".b2clogin.com/"],
            postLogoutRedirectUri: AppConfigService.settings["b2cConfig"].postLogoutRedirectUri,
            navigateToLoginRequestUrl: AppConfigService.settings["b2cConfig"].navigateToLoginRequestUrl
        },
        cache: {
            cacheLocation: AppConfigService.settings["b2cConfig"].cacheLocation,
            storeAuthStateInCookie: AppConfigService.settings["b2cConfig"].storeAuthStateInCookie
        }
    });
}

export function MSALGuardConfigFactory(config: AppConfigService): MsalGuardConfiguration {
    return {
        interactionType: AppConfigService.settings["b2cConfig"].interactionType,
        authRequest: {
            scopes: [AppConfigService.settings["fssConfig"].apiScope],
        },
    };
}
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    return {
        interactionType: AppConfigService.settings["b2cConfig"].interactionType,
        protectedResourceMap: new Map([
            [AppConfigService.settings["fssConfig"].apiUrl+'/auth/logout', null],
            [AppConfigService.settings["fssConfig"].apiUrl, [AppConfigService.settings["fssConfig"].apiScope]],
            [AppConfigService.settings["essConfig"].apiUrl, [AppConfigService.settings["essConfig"].apiScope]],         
        ]),
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
                AppConfigService, AnalyticsService,
                { provide: AUTH_CONFIG_URL_TOKEN, useValue: configFile },
                {
                    provide: APP_INITIALIZER, useFactory: initializerFactory,
                    deps: [AppConfigService, AUTH_CONFIG_URL_TOKEN], multi: true
                },
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
                {
                    provide: MSAL_INTERCEPTOR_CONFIG,
                    useFactory: MSALInterceptorConfigFactory,
                    deps: [AppConfigService]
                },
                MsalGuard,
                MsalService,
                MsalBroadcastService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MsalInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptorService,
                    multi: true
                }
            ]
        };
    }
}