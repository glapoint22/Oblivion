import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  ParamMap
} from '@angular/router';
import { DataService } from 'common';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { ProductOrders } from '../../classes/product-orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersResolver implements Resolve<any> {
  public filters!: Array<KeyValue<string, string>> | null;

  constructor(private dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const $filters = this.getFilters();
    const $orders = this.getOrders(route.queryParamMap);

    return forkJoin([$filters, $orders])
      .pipe(
        map(results => ({
          filters: results[0],
          orders: results[1].products ? null : results[1].orders,
          products: results[1].products ? results[1].products : null,
          searchTerm: route.queryParamMap.get('orderSearch'),
          selectedFilter: this.getSelectedFilter(results[0], route.queryParamMap)
        }))
      );
  }



  getFilters(): Observable<Array<KeyValue<string, string>>> {
    if (this.filters) {
      return of(this.filters);
    }

    return this.dataService.get<Array<KeyValue<string, string>>>('api/ProductOrders/GetOrderFilters', undefined, { authorization: true })
      .pipe(tap((filters: Array<KeyValue<string, string>>) => this.filters = filters));
  }


  getSelectedFilter(filters: Array<KeyValue<string, string>>, queryParams: ParamMap): KeyValue<string, string> {
    const index = Math.max(0, filters.findIndex(x => x.value == queryParams.get('filter')));
    return filters[index];
  }


  getOrders(queryParams: ParamMap): Observable<ProductOrders> {
    // Parameters we will pass to the server
    let parameters: Array<KeyValue<string, string>> = [];

    // Get all the query params from the url and assign it to the parameters array
    for (let i = 0; i < queryParams.keys.length; i++) {
      parameters.push({ key: queryParams.keys[i], value: queryParams.get(queryParams.keys[i]) as string });
    }

    // Get the orders
    return this.dataService.get<ProductOrders>('api/ProductOrders/GetOrders', parameters, { authorization: true });
  }
}