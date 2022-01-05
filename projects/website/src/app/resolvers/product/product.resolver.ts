import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Product } from '../../classes/product';
import { DataService } from '../../services/data/data.service';
import { VideoApiService } from '../../services/video-api/video-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {

  constructor(private dataService: DataService, private router: Router, private location: Location, private videoApiService: VideoApiService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Product> {
    const productId = route.paramMap.get('id');
    const productName = route.paramMap.get('urlTitle');

    return this.dataService.get<Product>('api/Products', [{ key: 'id', value: productId }], false)
      .pipe(tap((product: Product) => {
        if (!product) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState('/' + productName + '/' + productId);
        }
      }));
  }
}
