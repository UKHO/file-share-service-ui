import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfigService } from './app/core/services/app-config.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

async function bootstrapApplication(): Promise<void> {
  const response = await fetch('assets/config/appconfig.json');

  if (!response.ok) {
    throw new Error(`Failed to load application configuration: ${response.status} ${response.statusText}`);
  }

  AppConfigService.setSettings(await response.json());
  await platformBrowserDynamic().bootstrapModule(AppModule);
}

bootstrapApplication().catch(error => console.error(error));
