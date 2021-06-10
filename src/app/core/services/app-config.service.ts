import { Injectable }  from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
        providedIn: 'root'
    })

export class AppConfigService {
    static settings: any;
    private http: HttpClient;

    constructor(private readonly httpHandler: HttpBackend) {
        this.http = new HttpClient(httpHandler);
    }

    init(endpoint: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
          this.http.get(endpoint).pipe(map(result => result))
            .subscribe(value => {
              AppConfigService.settings = value;
              //console.log(AppConfigService.settings);
              resolve(true);
            },
            (error) => {
              reject(error);
            });
        });
      }
}




