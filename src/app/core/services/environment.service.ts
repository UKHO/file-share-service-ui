import { Injectable } from '@angular/core';
import { FssEnvironment } from './fss-environment.type';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    //private http: HttpClient,
    private environment: FssEnvironment
  ) { }

  getFssConfiguration() {
    return this.environment.fssConfiguration;
  }
}