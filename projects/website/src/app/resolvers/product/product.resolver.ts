import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AccountService, DataService } from 'common';
import { catchError, Observable, throwError } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<DetailProduct> {

  constructor(
    private dataService: DataService,
    private router: Router,
    private location: Location,
    private accountService: AccountService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DetailProduct> {
    const productId = route.paramMap.get('id');

    return this.dataService.get<DetailProduct>('api/Products/GetProduct', [{ key: 'productId', value: productId }],{
      authorization: this.accountService.user != undefined && this.accountService.user != null
    })
    .pipe(
      catchError(this.handleError(state))
    );
  }

  handleError(state: RouterStateSnapshot) {
    return (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.router.navigate(['**'], { skipLocationChange: true });
        this.location.replaceState(state.url);
      }

      return throwError(() => error);
    }
  }
}