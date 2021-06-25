import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule, PhaseBannerModule } from "@ukho/design-system";
import { HttpClientModule } from '@angular/common/http';
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { MsalConfigDynamicModule } from 'src/app/shared/components/msal-config-dynamic.module';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent
  ],

  imports: [
    BrowserModule, HeaderModule, FooterModule, PhaseBannerModule,
    HttpClientModule,
    MsalConfigDynamicModule.forRoot('assets/config/appconfig.json')
  ],
  providers:[],

  exports: [
    FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
