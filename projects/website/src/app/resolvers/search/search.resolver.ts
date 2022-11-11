import { Location } from '@angular/common';
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
    const nicheId = route.queryParamMap.get('nicheId');
    const subnicheId = route.queryParamMap.get('subnicheId');
    const filters = route.queryParamMap.get('filters');
    const sortBy = route.queryParamMap.get('sort');
    const page = route.queryParamMap.get('page');

    if (search && search != this.currentSearch) {
      this.currentSearch = search;

      // Return the page
      return this.dataService.get('api/Pages/GetSearchPage', [
        {
          key: 'searchTerm',
          value: search
        },
        {
          key: 'nicheId',
          value: nicheId ? nicheId : ''
        },
        {
          key: 'subnicheId',
          value: subnicheId ? subnicheId : ''
        },
        {
          key: 'filters',
          value: filters ? filters : ''
        },
        {
          key: 'sortBy',
          value: sortBy ? sortBy : ''
        },
        {
          key: 'page',
          value: page ? page : 1
        }
      ]);
    } else if (search) {

      // Return the grid data
      return this.dataService.get('api/Pages/GetGridData', [
        {
          key: 'searchTerm',
          value: search
        },
        {
          key: 'nicheId',
          value: nicheId ? nicheId : ''
        },
        {
          key: 'subnicheId',
          value: subnicheId ? subnicheId : ''
        },
        {
          key: 'filters',
          value: filters ? filters : ''
        },
        {
          key: 'sortBy',
          value: sortBy ? sortBy : ''
        },
        {
          key: 'page',
          value: page ? page : 1
        }
      ]);
    } else {
      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
  }
}