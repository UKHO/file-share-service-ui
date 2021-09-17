import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopularSearchConfigService {

  constructor(private http: HttpClient) {}

  getPopularSearchData() {
    return this.http.get('assets/config/popularsearchconfig.json');
  }

}
