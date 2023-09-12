import { InjectionToken, NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from   './shared/app.shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppConfigService } from './core/services/app-config.service';
import { AnalyticsService } from './core/services/analytics.service';
import { HttpErrorInterceptorService } from './core/services/httperror-interceptor.service';
import { msalConfig } from '../assets/config/auth-config';
import {
  MsalModule,
  MsalRedirectComponent,
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
  BrowserCacheLocation,
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';

//const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

export function initializerFactory(env: AppConfigService): any {
  const configUrl: string = 'assets/config/appconfig.json';
    const promise = env.init(configUrl).then((value) => { });
    return () => promise;
}

export function GTMFactory(): any {
  const googleTagManagerId = AppConfigService.settings.GoogleTagManagerId;
  return googleTagManagerId;
}





export function MSALInstanceFactory(): IPublicClientApplication {
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

export function MSALGuardConfigFac(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
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
            [AppConfigService.settings["fssConfig"].stateManagementApiUrl+'/logout', null],
            [AppConfigService.settings["fssConfig"].apiUrl, [AppConfigService.settings["fssConfig"].apiScope]],
            [AppConfigService.settings["essConfig"].apiUrl, [AppConfigService.settings["essConfig"].apiScope]],         
        ]),
    };
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule
    /*MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: msalConfig.auth.clientId
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: true
        }
      }),
      {
        // The routing guard configuration. 
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: []
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map([
          ['/logout', null]
        ])
      }
    )*/
  ],
  providers: [
    AppConfigService,
    AnalyticsService,
    //{
    //  provide: AUTH_CONFIG_URL_TOKEN,
    //  useValue: 'assets/config/appconfig.json' //configFile
    //},
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      deps: [AppConfigService], multi: true
    },
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
