import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopularSearchConfigService {

  constructor(private http: HttpClient) {}

  getPopularSearchData(fileName: string) {
    return this.http.get(`assets/config/${fileName}`);
  }

}
