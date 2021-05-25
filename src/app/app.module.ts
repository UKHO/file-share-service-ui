import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FssHeaderComponent } from './shared/components/fss-header/fss-header.component';
import { FssPhaseBannerComponent } from './shared/components/fss-phase-banner/fss-phase-banner.component';
import {SharedModule} from   './shared/app.shared.module'

@NgModule({
  declarations: [
    AppComponent,
    FssHeaderComponent,
    FssPhaseBannerComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
