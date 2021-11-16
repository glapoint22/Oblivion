import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, parameters?: Array<KeyValue<any, any>>, headers?: HttpHeaders): Observable<T> {
    let params = new HttpParams();

    if (parameters) parameters.forEach(x => params = params.set(x.key, x.value));
    return this.http.get<T>(url, { params: params, headers: headers });
  }

  post(url: string, body: any) {
    return this.http.post(url, body);
  }

  put(url: string, body: any, headers?: HttpHeaders) {
    return this.http.put(url, body, {headers});
  }
}
