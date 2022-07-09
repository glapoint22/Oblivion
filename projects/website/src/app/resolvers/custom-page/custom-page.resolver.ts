import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, tap } from 'rxjs';
import { PageContent, QueryParams } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class CustomPageResolver implements Resolve<PageContent> {

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageContent> {
    const queryParams = new QueryParams();

    queryParams.set(route.paramMap);

    // Return the page
    return this.dataService.post<PageContent>('api/Pages', queryParams)
      .pipe(tap((pageContent: PageContent) => {
        if (!pageContent) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState(state.url);
        }
      }));
  }
}