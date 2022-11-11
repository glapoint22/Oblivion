import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { DataService } from 'common';
import { GridData, PageContent } from 'widgets';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BrowseResolver implements Resolve<PageContent | GridData> {
  public currentId!: string | null;

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageContent | GridData> {
    const id = route.queryParamMap.has('subnicheId') ? route.queryParamMap.get('subnicheId') : route.queryParamMap.get('nicheId');
    const nicheId = route.queryParamMap.get('nicheId');
    const subnicheId = route.queryParamMap.get('subnicheId');
    const filters = route.queryParamMap.get('filters');
    const sortBy = route.queryParamMap.get('sortBy');
    const page = route.queryParamMap.get('page');

    if (id && id != this.currentId) {
      this.currentId = id;

      // Return the page
      return this.dataService.get<PageContent | GridData>('api/Pages/GetBrowsePage', [
        {
          key: 'nicheId',
          value: nicheId
        },
        {
          key: 'subnicheId',
          value: subnicheId
        },
        {
          key: 'filters',
          value: filters
        },
        {
          key: 'sortBy',
          value: sortBy
        },
        {
          key: 'page',
          value: page
        }
      ])
        .pipe(
          catchError<PageContent | GridData, Observable<PageContent | GridData>>(this.handleError(state))
        );
    } else if (id && id == this.currentId) {

      // Return the grid data
      return this.dataService.get<PageContent | GridData>('api/Pages/GetGridData', [
        {
          key: 'nicheId',
          value: nicheId
        },
        {
          key: 'subnicheId',
          value: subnicheId
        },
        {
          key: 'filters',
          value: filters
        },
        {
          key: 'sortBy',
          value: sortBy
        },
        {
          key: 'page',
          value: page
        }
      ])
        .pipe(
          catchError<PageContent | GridData, Observable<PageContent | GridData>>(this.handleError(state))
        );
    } else {
      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
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