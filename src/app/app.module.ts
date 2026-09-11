import { NgModule,provideAppInitializer, inject, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from   './shared/app.shared.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppConfigService } from './core/services/app-config.service';
import { AnalyticsService } from './core/services/analytics.service';
import { HttpErrorInterceptorService } from './core/services/httperror-interceptor.service';
import { ApmErrorHandler, ApmModule, ApmService } from '@elastic/apm-rum-angular'
import { init as initApm } from '@elastic/apm-rum'

import {
  MsalModule,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalBroadcastService,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';


export function GTMFactory(): any {
  const settings = AppConfigService.getSettings();
  const googleTagManagerId = settings.GoogleTagManagerId;
  return googleTagManagerId;
}

export function ApmFactory(): any {
  const settings = AppConfigService.getSettings();
  return initApm({
    serviceName: settings['elasticAPM'].ServiceName,
    serverUrl: settings['elasticAPM'].ServerURL,
    environment: settings['elasticAPM'].Environment
  });
}


export function MSALInstanceFactory(): IPublicClientApplication {
    const settings = AppConfigService.getSettings();
    const b2cConfig = settings["b2cConfig"];
    const tenantName = b2cConfig.tenantName;

    return new PublicClientApplication({
        auth: {
            clientId: b2cConfig.clientId,
            authority: "https://" + tenantName + ".b2clogin.com/" + tenantName + ".onmicrosoft.com/" + b2cConfig.signUpSignIn,
            redirectUri: b2cConfig.redirectUri,
            knownAuthorities: [tenantName + ".b2clogin.com/"],
            postLogoutRedirectUri: b2cConfig.postLogoutRedirectUri,
            navigateToLoginRequestUrl: b2cConfig.navigateToLoginRequestUrl
        },
        cache: {
            cacheLocation: b2cConfig.cacheLocation,
            storeAuthStateInCookie: b2cConfig.storeAuthStateInCookie
        }
    });
}

export function MSALGuardConfigFac(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    const settings = AppConfigService.getSettings();
    const b2cConfig = settings["b2cConfig"];
    const fssConfig = settings["fssConfig"];

    return {
        interactionType: b2cConfig.interactionType,
        authRequest: {
            scopes: [fssConfig.apiScope],
        },
    };
}
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const settings = AppConfigService.getSettings();
    const b2cConfig = settings["b2cConfig"];
    const fssConfig = settings["fssConfig"];
    const essConfig = settings["essConfig"];

    return {
        interactionType: b2cConfig.interactionType,
        protectedResourceMap: new Map([
            [fssConfig.stateManagementApiUrl+'/logout', null],
            [fssConfig.apiUrl, [fssConfig.apiScope]],
            [essConfig.apiUrl, [essConfig.apiScope]],
            [essConfig.apiUiUrl, [essConfig.apiScope]]     
        ]),
    };
}


@NgModule({ declarations: [
        AppComponent
    ],   
    bootstrap: [AppComponent], imports: [BrowserModule,        
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AppRoutingModule,
        MsalModule,
        ApmModule], providers: [
        ApmService,
        {
            provide: 'APM_BASE_CLIENT',
            useFactory: ApmFactory
        },    
        
        AnalyticsService,
        provideAppInitializer(() => inject(AppConfigService).init('assets/config/appconfig.json')),
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory
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
        },
        { provide: 'googleTagManagerId',
            useFactory: GTMFactory
        },
        {
            provide: ErrorHandler,
            useClass: ApmErrorHandler
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {      
}
