import { KeyValue, Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, of } from 'rxjs';
import { GridData, PageContent } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class SearchResolver implements Resolve<PageContent | GridData> {
  public currentSearch!: string | null;

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageContent | GridData> {
    const search = route.queryParamMap.get('search');

    let params: Array<KeyValue<any, any>> = [
      {
        key: 'searchTerm',
        value: search
      },
      {
        key: 'nicheId',
        value: route.queryParamMap.has('nicheId') ? route.queryParamMap.get('nicheId') : ''
      },
      {
        key: 'subnicheId',
        value: route.queryParamMap.has('subnicheId') ? route.queryParamMap.get('subnicheId') : ''
      },
      {
        key: 'filters',
        value: route.queryParamMap.has('filters') ? route.queryParamMap.get('filters') : ''
      },
      {
        key: 'sortBy',
        value: route.queryParamMap.has('sort') ? route.queryParamMap.get('sort') : ''
      },
      {
        key: 'page',
        value: route.queryParamMap.has('page') ? route.queryParamMap.get('page') : 1
      }
    ]

    if (search && search != this.currentSearch) {
      this.currentSearch = search;

      // Return the page
      return this.dataService.get('api/Pages/GetSearchPage', params);
    } else if (search) {

      // Return the grid data
      return this.dataService.get('api/Pages/GetGridData', params);
    } else {
      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
  }
}