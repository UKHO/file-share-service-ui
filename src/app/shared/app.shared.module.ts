import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule, FooterModule } from "@ukho/design-system";
import { FssFooterComponent } from './components';

@NgModule({
  declarations: [FssFooterComponent],

  imports: [
    BrowserModule, HeaderModule, FooterModule
  ],

  exports: [
      HeaderModule, FssFooterComponent
  ]
})

export class SharedModule { }
