import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/app.shared.module';

import { environment } from 'src/environments/environment';
import { FssEnvironment } from 'src/app/core/services/fss-environment.type';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide: FssEnvironment, useValue: environment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
