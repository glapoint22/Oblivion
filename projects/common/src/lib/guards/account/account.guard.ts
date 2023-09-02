import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard  {

  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.accountService.user) {
      this.router.navigate(['log-in'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    return true;
  }

}