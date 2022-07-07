import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from   './shared/app.shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './core/services/app-config.service';
// import { ExchangeSetComponent } from './features/exchange-set/exchange-set.component';

export function GTMFactory(config: AppConfigService): any {
  const googleTagManagerId = AppConfigService.settings.GoogleTagManagerId;
  return googleTagManagerId;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,FormsModule, ReactiveFormsModule,
    SharedModule,
    AppRoutingModule, HttpClientModule
  ],
  providers: [AppConfigService,
    { provide: 'googleTagManagerId',  useFactory: GTMFactory,
    deps: [AppConfigService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
