import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule, PhaseBannerModule } from "@ukho/design-system";
import { FssFooterComponent } from './components';

@NgModule({
  declarations: [FssFooterComponent],

  imports: [
    BrowserModule, HeaderModule, FooterModule, PhaseBannerModule
  ],

  exports: [
      HeaderModule, FssFooterComponent, PhaseBannerModule
  ]
})

export class SharedModule { }
