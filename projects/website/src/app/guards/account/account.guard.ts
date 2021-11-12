import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanLoad, CanActivate {

  constructor(private accountService: AccountService, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.accountService.customer) {
      this.router.navigate(['log-in']);
      return false;
    }

    return true;
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.accountService.customer) {
      this.router.navigate(['log-in']);
      return false;
    }

    return true;
  }

}
