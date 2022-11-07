import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Location } from '@angular/common';
import { DataService, GridData } from 'common';
import { PageContent, QueryParams } from 'widgets';


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
    const queryParams = new QueryParams();

    queryParams.set(route.queryParamMap);

    if (id && id != this.currentId) {
      this.currentId = id;

      // Return the page
      return this.dataService.post<PageContent>('api/Pages/Browse', queryParams)
        .pipe(tap((pageContent: PageContent) => {
          if (!pageContent) {
            this.router.navigate(['**'], { skipLocationChange: true });
            this.location.replaceState(state.url);
          }
        }));
    } else if (id && id == this.currentId) {

      // Return the grid data
      return this.dataService.post('api/Pages/GridData', queryParams);
    } else {


      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
  }
}