import { Injectable } from '@angular/core';
import { FssConfiguration } from './fss-configuration.types';
import { FssEnvironment } from './fss-environment.type';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    //private http: HttpClient,
    private environment: FssEnvironment
  ) { }

  getFssConfiguration(): FssConfiguration {
    return this.environment.fssConfiguration;
  }  
}