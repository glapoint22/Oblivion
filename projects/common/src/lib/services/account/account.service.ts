import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { User } from '../../classes/user';
import { CookieService } from '../cookie/cookie.service';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private interval!: number;
  public user: User | undefined;
  public refreshTokenSet!: boolean;
  private waitForRefreshToken = new Subject<void>();
  public refreshing!: boolean;
  public onRedirect = new Subject<void>();
  public redirectListener!: Subscription;

  constructor
    (
      private cookieService: CookieService,
      private dataService: DataService,
      private router: Router,
      private route: ActivatedRoute,
    ) {
  }

  public setUser() {
    let userCookie = this.cookieService.getCookie('user');

    if (userCookie) {
      userCookie = decodeURIComponent(userCookie);
      const userProperties = userCookie.split(',');
      this.user = new User(userProperties[0], userProperties[1], userProperties[2], userProperties[3], userProperties[4], userProperties[5] == 'True');
    }
  }


  public logIn() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    this.setUser();
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
      const dataServiceGetSubscription = this.dataService.get('api/Account/LogOut').subscribe(() => {
        dataServiceGetSubscription.unsubscribe();
        this.user = undefined;
      });
      this.router.navigate(['/log-in']);
    } else {

      // Wait for refreshing to end, then log out
      const subscription: Subscription = this.waitForRefreshToken.subscribe(() => {
        const dataServiceGetSubscription =  this.dataService.get('api/Account/LogOut').subscribe(()=> {
          dataServiceGetSubscription.unsubscribe();
        });
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
    this.refreshTokenSet = false;

    // Get a new refresh token
    const dataServiceGetSubscription = this.dataService.get('api/Account/Refresh', undefined, { authorization: true })
      .subscribe({
        next: (newRefreshToken: any) => {
          this.refreshTokenSet = true;
          this.refreshing = false;
          this.waitForRefreshToken.next();

          dataServiceGetSubscription.unsubscribe();

          // Make a call to the server to delete all old refresh tokens
          const dataServiceDeleteSubscription = this.dataService.delete('api/Account/Refresh', { newRefreshToken: encodeURIComponent(newRefreshToken.value) }, { authorization: true })
            .subscribe(()=> {
              dataServiceDeleteSubscription.unsubscribe();
            });
        },

        error: (error: HttpErrorResponse) => {
          dataServiceGetSubscription.unsubscribe();
          // Something went wrong trying to refresh the token
          if (error.status == 404) {
            this.refreshTokenSet = true;
            this.refreshing = false;
            this.waitForRefreshToken.next();
            this.logOut();
          }
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