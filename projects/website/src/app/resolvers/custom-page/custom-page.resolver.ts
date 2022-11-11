import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, of } from 'rxjs';
import { PageContent } from 'widgets';

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
    const id = route.queryParamMap.get('id');
    const pageType = route.queryParamMap.get('pageType');

    // Return the page
    if (id) {
      return this.dataService.get<PageContent>('api/Pages/PageId', [
        {
          key: 'id',
          value: id
        }
      ])
    } else if (pageType) {
      return this.dataService.get<PageContent>('api/Pages/PageType', [
        {
          key: 'pageType',
          value: pageType
        }
      ])
    } else {
      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
  }
}