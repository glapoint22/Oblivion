import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  get<T>(url: string, parameters?: Array<KeyValue<any, any>>, authorization?: boolean): Observable<T> {
    return this.http.get<T>(url, { params: this.setParams(parameters), headers: authorization ? this.getHeaders() : new HttpHeaders() });
  }

  post<T>(url: string, body: any, authorization?: boolean): Observable<T> {
    return this.http.post<T>(url, body, { headers: authorization ? this.getHeaders() : new HttpHeaders() });
  }

  put<T>(url: string, body: any, authorization?: boolean): Observable<T> {
    return this.http.put<T>(url, body, { headers: authorization ? this.getHeaders() : new HttpHeaders() });
  }

  delete(url: string, params: any, authorization?: boolean) {
    return this.http.delete(url, { params: params, headers: authorization ? this.getHeaders() : new HttpHeaders() });
  }



  setParams(parameters?: Array<KeyValue<any, any>>): HttpParams {
    let params = new HttpParams();

    if (parameters) parameters.forEach(x => params = params.set(x.key, x.value));
    return params;
  }


  public getHeaders(): HttpHeaders | undefined {
    const accessToken = this.cookieService.getCookie('access');

    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken
    });
  }
}