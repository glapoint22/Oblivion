import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Location } from '@angular/common';
import { DataService } from 'common';
import { QueryParams } from 'widgets';


@Injectable({
  providedIn: 'root'
})
export class BrowseResolver implements Resolve<any> {
  public currentId!: string | null;

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.queryParamMap.has('nicheId') ? route.queryParamMap.get('nicheId') : route.queryParamMap.get('categoryId');
    const queryParams = new QueryParams();

    queryParams.set(route.queryParamMap);

    if (id && id != this.currentId) {
      this.currentId = id;

      // Return the page
      return this.dataService.post('api/Pages/Browse', queryParams)
        .pipe(tap(page => {
          if (!page) {
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