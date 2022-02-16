import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { catchError, mergeMap, Observable, retryWhen, tap, throwError, timer } from 'rxjs';
import { Event, NavigationStart, Router } from '@angular/router';
import { SpinnerAction } from '../../classes/enums';
import { CookieService } from '../cookie/cookie.service';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url!: string;

  constructor
    (
      private http: HttpClient,
      private cookieService: CookieService,
      private spinnerService: SpinnerService,
      private router: Router
    ) {
    // Router Events
    this.router.events
      .subscribe((event: Event) => {
        // Navigation Start
        if (event instanceof NavigationStart) {
          if (event.url != '/error') this.url = event.url;
        }
      });
  }

  // ------------------------------------------------------------Get-----------------------------------------------------
  get<T>(url: string, parameters?: Array<KeyValue<any, any>>, options?: {
    authorization?: boolean,
    spinnerAction?: SpinnerAction,
    endSpinnerWhen?: (result: any) => boolean
  }): Observable<T> {

    // start spinner
    if (options && (options.spinnerAction == SpinnerAction.Start || options.spinnerAction == SpinnerAction.StartEnd)) this.spinnerService.show = true;


    return this.http.get<T>(url, { params: this.setParams(parameters), headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(
        tap((result) => {
          // End spinner
          if (options && (options.spinnerAction == SpinnerAction.End || options.spinnerAction == SpinnerAction.StartEnd ||
            (options.endSpinnerWhen && options.endSpinnerWhen(result) == true))) this.spinnerService.show = false;

        }),
        retryWhen(this.retryRequest()),
        catchError(this.handleError())
      );
  }








  // ------------------------------------------------------------Post-----------------------------------------------------
  post<T>(url: string, body: any, options?: {
    authorization?: boolean,
    spinnerAction?: SpinnerAction,
    endSpinnerWhen?: (result: any) => boolean
  }): Observable<T> {

    // start spinner
    if (options && (options.spinnerAction == SpinnerAction.Start || options.spinnerAction == SpinnerAction.StartEnd)) this.spinnerService.show = true;


    return this.http.post<T>(url, body, { headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(
        tap((result) => {

          // End spinner
          if (options && (options.spinnerAction == SpinnerAction.End || options.spinnerAction == SpinnerAction.StartEnd ||
            (options.endSpinnerWhen && options.endSpinnerWhen(result) == true))) this.spinnerService.show = false;
        }),
        retryWhen(this.retryRequest()),
        catchError(this.handleError())
      );
  }






  // ------------------------------------------------------------Put-----------------------------------------------------
  put<T>(url: string, body: any, options?: {
    authorization?: boolean,
    spinnerAction?: SpinnerAction,
    endSpinnerWhen?: (result: any) => boolean
  }): Observable<T> {

    // start spinner
    if (options && (options.spinnerAction == SpinnerAction.Start || options.spinnerAction == SpinnerAction.StartEnd)) this.spinnerService.show = true;

    return this.http.put<T>(url, body, { headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(
        tap((result) => {

          // End spinner
          if (options && (options.spinnerAction == SpinnerAction.End || options.spinnerAction == SpinnerAction.StartEnd ||
            (options.endSpinnerWhen && options.endSpinnerWhen(result) == true))) this.spinnerService.show = false;
        }),
        retryWhen(this.retryRequest()),
        catchError(this.handleError())
      );
  }






  // ------------------------------------------------------------Delete-----------------------------------------------------
  delete(url: string, params: any, options?: {
    authorization?: boolean,
    spinnerAction?: SpinnerAction,
    endSpinnerWhen?: (result: any) => boolean
  }) {

    // start spinner
    if (options && (options.spinnerAction == SpinnerAction.Start || options.spinnerAction == SpinnerAction.StartEnd)) this.spinnerService.show = true;

    return this.http.delete(url, { params: params, headers: options && options.authorization ? this.getHeaders() : new HttpHeaders() })
      .pipe(
        tap((result) => {

          // End spinner
          if (options && (options.spinnerAction == SpinnerAction.End || options.spinnerAction == SpinnerAction.StartEnd ||
            (options.endSpinnerWhen && options.endSpinnerWhen(result) == true))) this.spinnerService.show = false;
        }),
        retryWhen(this.retryRequest()),
        catchError(this.handleError())
      );
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






  // ------------------------------------------------------------Retry Request-----------------------------------------------------
  retryRequest() {
    const maxRetryAttempts = 3;
    const duration = 1000;

    return (errors: Observable<HttpErrorResponse>) => errors
      .pipe(mergeMap((error: any, i: number) => {
        const retryAttempts = i + 1;

        if (retryAttempts > maxRetryAttempts) {
          return error;
        } else {
          return timer(duration);
        }
      }));
  }





  // ------------------------------------------------------------Handle Error-----------------------------------------------------
  handleError() {
    return (error: HttpErrorResponse) => {
      this.router.navigate(['error'], { skipLocationChange: true });
      window.history.pushState('', '', this.url);

      return throwError(() => error);
    }
  }
}