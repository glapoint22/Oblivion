import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Customer } from '../../classes/customer';
import { CookieService } from '../cookie/cookie.service';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public customer: Customer | undefined;
  public refreshTokenSet!: boolean;
  private waitForRefreshToken = new Subject<void>();
  private timerRunning!: boolean;
  private interval!: number;
  public refreshing!: boolean;

  constructor(private cookieService: CookieService, private dataService: DataService) { }

  public setCustomer() {
    let customerCookie = this.cookieService.getCookie('customer');

    if (customerCookie) {
      customerCookie = decodeURIComponent(customerCookie);
      const customerProperties = customerCookie.split(',');
      this.customer = new Customer(customerProperties[0], customerProperties[1], customerProperties[2], customerProperties[3]);

      // If the refresh timer is not already running and we have both access and refresh cookies, start the timer
      if (!this.timerRunning && document.cookie.includes('access') && document.cookie.includes('refresh')) this.startRefreshTokenTimer();
    }
  }


  public logOut() {
    // Stop the refresh timer
    window.clearInterval(this.interval);
    this.timerRunning = false;


    this.customer = undefined;

    // If not in the middle of refreshing, log out
    if (!this.refreshing) {
      this.dataService.get('api/Account/LogOut').subscribe();
    } else {

      // Wait for refreshing to end, then log out
      const subscription: Subscription = this.waitForRefreshToken.subscribe(() => {
        this.dataService.get('api/Account/LogOut').subscribe();
        subscription.unsubscribe();
      });
    }
  }


  public startRefreshTokenTimer() {
    this.timerRunning = true;
    this.refresh();
    this.interval = window.setInterval(() => {
      this.refresh();
      // 15 Minutes
    }, 1000 * 60 * 15);
  }


  public refresh() {
    // Flag that we are in the refreshing process
    this.refreshing = true;

    // Get a new refresh token
    this.dataService.get('api/Account/Refresh', undefined, { authorization: true })
      .subscribe((newRefreshToken: any) => {
        this.refreshTokenSet = true;
        this.waitForRefreshToken.next();

        // This will delete all refresh tokens from this user except the new one we just got
        if (newRefreshToken) {
          this.dataService.delete('api/Account/Refresh', {
            newRefreshToken: encodeURIComponent(newRefreshToken.value)
          }, { authorization: true }).subscribe(() => {
            this.refreshing = false;
          });
        }
      });
  }


  public waitForToken(): Observable<HttpRequest<unknown>> {
    return new Observable<HttpRequest<unknown>>((subscriber: Subscriber<HttpRequest<unknown>>) => {
      const subscription: Subscription = this.waitForRefreshToken
        .subscribe(() => {
          subscriber.next();
          subscriber.complete();
          subscription.unsubscribe();
        });
    });
  }
}