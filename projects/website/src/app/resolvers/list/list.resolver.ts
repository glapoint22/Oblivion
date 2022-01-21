import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { List } from '../../classes/list';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<List> {
  constructor(private dataService: DataService, private router: Router) { }

  resolve(): Observable<List> {
    return this.dataService.get<List>('api/Lists/FirstList', undefined, { authorization: true })
      .pipe(tap((list: List) => {
        if (list) {
          this.router.navigate(['account/lists', list.id]);
        }
      }));
  }
}