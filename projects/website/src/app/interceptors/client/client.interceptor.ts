import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { DataService } from 'common';

@Injectable()
export class ClientInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService, private dataService: DataService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If this request does NOT need authorization
    if (this.accountService.refreshTokenSet || request.url == 'api/Account/Refresh' || !request.headers.has('Authorization')) return next.handle(request);

    // Wait for the new access token
    return this.accountService.waitForToken().pipe(mergeMap(() => {

      // This will add new headers with the new access token
      const requestClone = request.clone({
        headers: this.dataService.getHeaders()
      })
      return next.handle(requestClone);
    }));
  }
}
