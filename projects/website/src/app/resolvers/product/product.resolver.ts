import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Product } from '../../classes/product';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {

  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId = route.paramMap.get('id');

    return this.dataService.get<Product>('api/Products', [{ key: 'id', value: productId }])
      .pipe(tap((product: Product) => {
        if (!product) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState(state.url);
        }
      }));
  }
}