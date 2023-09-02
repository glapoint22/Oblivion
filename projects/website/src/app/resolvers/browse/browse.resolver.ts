import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { KeyValue, Location } from '@angular/common';
import { DataService } from 'common';
import { GridData, PageContent } from 'widgets';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BrowseResolver  {
  public currentId!: string | null;

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageContent | GridData> {
    const id = route.queryParamMap.has('subnicheId') ? route.queryParamMap.get('subnicheId') : route.queryParamMap.get('nicheId');
    
    let params: Array<KeyValue<any, any>> = [
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


    if (id && id != this.currentId) {
      this.currentId = id;

      // Return the page
      return this.dataService.get<PageContent | GridData>('api/Pages/GetBrowsePage', params)
        .pipe(
          catchError<PageContent | GridData, Observable<PageContent | GridData>>(this.handleError(state))
        );
    } else if (id && id == this.currentId) {

      // Return the grid data
      return this.dataService.get<PageContent | GridData>('api/Pages/GetGridData', params)
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