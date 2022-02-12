import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, tap } from 'rxjs';
import { DetailProduct } from '../../classes/detail-product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<DetailProduct> {

  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DetailProduct> {
    const productId = route.paramMap.get('id');

    return this.dataService.get<DetailProduct>('api/Products', [{ key: 'id', value: productId }])
      .pipe(tap((product: DetailProduct) => {
        if (!product) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState(state.url);
        }
      }));
  }
}