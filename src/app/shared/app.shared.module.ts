import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule, PhaseBannerModule } from "@ukho/design-system";
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent
  ],

  imports: [
    BrowserModule, HeaderModule, FooterModule, PhaseBannerModule
  ],

  exports: [
      FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
