import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule, PhaseBannerModule } from "@ukho/design-system";
import { HttpClientModule } from '@angular/common/http';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { msalConfig } from 'src/assets/config/auth-config';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}
@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent
  ],

  imports: [
    BrowserModule, HeaderModule, FooterModule, PhaseBannerModule,
    HttpClientModule,
    MsalModule
  ],
  providers:
    [{
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
      MsalService],

  exports: [
    FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
