import { Injectable }  from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
        providedIn: 'root'
    })

export class AppConfigService {
    static settings: any = null;
    static isLoaded = false;
    private http: HttpClient;

    constructor(private readonly httpHandler: HttpBackend) {
        this.http = new HttpClient(httpHandler);
    }

    static getSettings(): any {
        if (!AppConfigService.isLoaded || !AppConfigService.settings) {
            throw new Error('Application configuration has not finished loading yet.');
        }

        return AppConfigService.settings;
    }

    init(endpoint: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
          this.http.get(endpoint).pipe(map(result => result))
            .subscribe({
              next: (value: unknown) => {
                AppConfigService.settings = value;
                AppConfigService.isLoaded = true;
                resolve(true);
              },
              error: (error: unknown) => {
                AppConfigService.settings = null;
                AppConfigService.isLoaded = false;
                reject(error);
              }
            });
        });
      }
}




