import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from "@ukho/design-system";

@NgModule({
  declarations: [
  ],

  imports: [
    BrowserModule, HeaderModule
  ],

  exports: [
      HeaderModule
  ]
})

export class SharedModule { }
