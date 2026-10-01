import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfigService } from './app/core/services/app-config.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

fetch('assets/config/appconfig.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load application configuration: ${response.status} ${response.statusText}`);
    }

    return response.json();
  })
  .then(config => {
    AppConfigService.setSettings(config);
    return platformBrowserDynamic().bootstrapModule(AppModule);
  })
  .catch(err => console.error(err));
