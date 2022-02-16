import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { DataService } from 'common';
import { Observable, of, switchMap } from 'rxjs';
import { List } from '../../classes/list';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<List | null> {
  constructor(private dataService: DataService, private router: Router) { }

  resolve(): Observable<List | null> {
    return this.dataService.get<List | null>('api/Lists/FirstList', undefined, { authorization: true })
      .pipe(
        switchMap((list: List | null) => {
          if (list && list.id) {
            this.router.navigate(['account/lists', list.id]);
            return of(list);
          } else {
            return of(null);
          }
        })
      );
  }
}