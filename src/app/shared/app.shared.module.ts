import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { HeaderModule, FooterModule, PhaseBannerModule, HorizontalRuleModule } from "@ukho/design-system";
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { HttpClientModule } from '@angular/common/http';
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { MsalConfigDynamicModule } from 'src/app/shared/components/msal-config-dynamic.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent
  ],

  imports: [
    //HeaderModule, FooterModule, PhaseBannerModule, HorizontalRuleModule,
    BrowserModule, HttpClientModule, ReactiveFormsModule, DesignSystemModule.forRoot(),
    MsalConfigDynamicModule.forRoot('assets/config/appconfig.json')
  ],
  providers:[],

  exports: [
    FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
