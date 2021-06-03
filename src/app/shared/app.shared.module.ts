import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule, PhaseBannerModule,ButtonModule,SelectModule,CheckboxModule,TextinputModule } from "@ukho/design-system";
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { FssSearchComponent } from './components/fss-search/fss-search.component';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent,
    FssSearchComponent
  ],

  imports: [
    BrowserModule, HeaderModule, FooterModule, PhaseBannerModule,ButtonModule,SelectModule,CheckboxModule,TextinputModule
  ],

  exports: [
      FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
