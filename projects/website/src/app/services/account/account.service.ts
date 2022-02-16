import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService, DataService } from 'common';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Customer } from '../../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public customer: Customer | undefined;
  public refreshTokenSet!: boolean;
  private waitForRefreshToken = new Subject<void>();
  private interval!: number;
  public refreshing!: boolean;
  public onRedirect = new Subject<void>();

  constructor
    (
      private cookieService: CookieService,
      private dataService: DataService,
      private router: Router,
      private route: ActivatedRoute
    ) { }

  public setCustomer() {
    let customerCookie = this.cookieService.getCookie('customer');

    if (customerCookie) {
      customerCookie = decodeURIComponent(customerCookie);
      const customerProperties = customerCookie.split(',');
      this.customer = new Customer(customerProperties[0], customerProperties[1], customerProperties[2], customerProperties[3], customerProperties[4], customerProperties[5] == 'True');
    }
  }


  public logIn() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    this.setCustomer();
    this.refreshTokenSet = true;
    this.startRefreshTokenTimer();



    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (!this.onRedirect.observed) {
      this.router.navigate(['/']);
    }
  }


  public logOut() {
    // Stop the refresh timer
    window.clearInterval(this.interval);

    // If not in the middle of refreshing, log out
    if (!this.refreshing) {
      this.dataService.get('api/Account/LogOut').subscribe(()=> {
        this.customer = undefined;
      });
      this.router.navigate(['/log-in']);
    } else {

      // Wait for refreshing to end, then log out
      const subscription: Subscription = this.waitForRefreshToken.subscribe(() => {
        this.dataService.get('api/Account/LogOut').subscribe();
        subscription.unsubscribe();
        this.router.navigate(['/log-in']);
      });
    }
  }


  public startRefreshTokenTimer() {
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
        this.refreshing = false;
        this.waitForRefreshToken.next();

        // If we received a new refresh token,
        // Make a call to the server to delete all old refresh tokens
        if (newRefreshToken) {
          this.dataService.delete('api/Account/Refresh', { newRefreshToken: encodeURIComponent(newRefreshToken.value) }, { authorization: true })
            .subscribe();
        } else {
          this.logOut();
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