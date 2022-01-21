import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { CookieService } from '../cookie/cookie.service';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private cookieService: CookieService, private spinnerService: SpinnerService) { }

  // ------------------------------------------------------------Get-----------------------------------------------------
  get<T>(url: string, parameters?: Array<KeyValue<any, any>>, options?: {
    authorization?: boolean,
    showSpinner?: boolean
  }): Observable<T> {

    // Show spinner?
    if (options && options.showSpinner) this.spinnerService.show = true;

    return this.http.get<T>(url, { params: this.setParams(parameters), headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(tap(() => {

        // Hide spinner
        if (options) {
          if (options.showSpinner) this.spinnerService.show = false;
        }
      }));
  }






  // ------------------------------------------------------------Post-----------------------------------------------------
  post<T>(url: string, body: any, options?: {
    authorization?: boolean,
    showSpinner?: boolean
  }): Observable<T> {

    // Show spinner?
    if (options && options.showSpinner) this.spinnerService.show = true;


    return this.http.post<T>(url, body, { headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(tap(() => {

        // Hide spinner
        if (options) {
          if (options.showSpinner) this.spinnerService.show = false;
        }
      }));
  }






  // ------------------------------------------------------------Put-----------------------------------------------------
  put<T>(url: string, body: any, options?: {
    authorization?: boolean,
    showSpinner?: boolean
  }): Observable<T> {
    return this.http.put<T>(url, body, { headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(tap(() => {

        // Hide spinner
        if (options) {
          if (options.showSpinner) this.spinnerService.show = false;
        }
      }));
  }






  // ------------------------------------------------------------Delete-----------------------------------------------------
  delete(url: string, params: any, options?: {
    authorization?: boolean,
    showSpinner?: boolean
  }) {
    return this.http.delete(url, { params: params, headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(tap(() => {

        // Hide spinner
        if (options) {
          if (options.showSpinner) this.spinnerService.show = false;
        }
      }));
  }








  // ------------------------------------------------------------Set Params-----------------------------------------------------
  setParams(parameters?: Array<KeyValue<any, any>>): HttpParams {
    let params = new HttpParams();

    if (parameters) parameters.forEach(x => params = params.set(x.key, x.value));
    return params;
  }







  // ------------------------------------------------------------Get Headers-----------------------------------------------------
  public getHeaders(): HttpHeaders | undefined {
    const accessToken = this.cookieService.getCookie('access');

    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken
    });
  }
}