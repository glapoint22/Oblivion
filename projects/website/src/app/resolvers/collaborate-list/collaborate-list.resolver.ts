import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { DataService } from 'common';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborateListResolver implements Resolve<any> {

  constructor(private dataService: DataService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dataService.get(
      'api/Lists/ListInfo',
      [{ key: 'collaborateId', value: route.paramMap.get('collaborateListId') }],
      { authorization: true }
    ).pipe(tap((listInfo: any) => {

      // If user is already collaborating on this list, navigate to the list page
      if (listInfo.exists) this.router.navigate(['account', 'lists', listInfo.listId]);
    }));
  }
}