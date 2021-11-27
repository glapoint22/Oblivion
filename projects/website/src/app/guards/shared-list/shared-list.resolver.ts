import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharedList } from '../../classes/shared-list';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedListResolver implements Resolve<SharedList> {
  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SharedList> {
    return this.dataService.get<SharedList>('api/Lists/List', [{ key: 'listId', value: route.paramMap.get('listId') }])
      .pipe(tap((sharedList: SharedList) => {
        if (!sharedList) {
          this.router.navigate(['**'], { skipLocationChange: true });
          this.location.replaceState("/shared-list/" + route.paramMap.get('listId'));
        }
      }));
  }
}