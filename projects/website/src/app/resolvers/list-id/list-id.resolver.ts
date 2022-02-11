import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, map, mergeMap, Observable, of, tap } from 'rxjs';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ListIdResolver implements Resolve<any> {
  public lists!: Array<List> | null;

  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.getLits(route.paramMap.get('listId') as string)
      .pipe(
        mergeMap((lists: Array<List>) => {
          let selectedList: List | null = null;

          // Get the listid from the url
          const listId = route.paramMap.get('listId');

          // Get the current selected list
          if (listId) {
            selectedList = lists.find(x => x.id == listId) as List;
          }

          // If the selected list is not found
          if (!selectedList) {
            this.router.navigate(['**'], { skipLocationChange: true });
            this.location.replaceState(state.url);
            return of();
          }

          // Get the products
          const $products = this.dataService
            .get<Array<ListProduct>>('api/Lists/Products', [
              { key: 'listId', value: selectedList.id },
              { key: 'sort', value: route.queryParamMap.has('sort') ? route.queryParamMap.get('sort') : '' }
            ], { authorization: true });


          // Join the lists and products together
          return forkJoin([of(lists), $products, of(selectedList)])

        }),
        // Map into lists and products
        map(results => ({
          lists: results[0],
          products: results[1],
          selectedList: results[2]
        }))
      );
  }




  getLits(listId: string): Observable<Array<List>> {
    if (this.lists) {
      return of(this.lists);
    }

    return this.dataService.get<Array<List>>('api/Lists/', [{ key: 'firstList', value: listId }], { authorization: true })
      .pipe(tap((lists: Array<List>) => this.lists = lists));
  }
}
