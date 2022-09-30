import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, tap } from 'rxjs';
import { SharedList } from '../../classes/shared-list';

@Injectable({
  providedIn: 'root'
})
export class SharedListResolver implements Resolve<SharedList> {
  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SharedList> {

    return this.dataService.get<SharedList>('api/Lists/SharedList',
      [
        { key: 'listId', value: route.paramMap.get('listId') },
        { key: 'sort', value: route.queryParamMap.get('sort') ? route.queryParamMap.get('sort') : '' }
      ])
      .pipe(tap((sharedList: SharedList) => {
        if (!sharedList) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState(state.url);
        }
      }));
  }
}