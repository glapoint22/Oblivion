import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { List } from '../../classes/list';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<List> {
  constructor(private dataService: DataService, private accountService: AccountService, private router: Router) { }

  resolve(): Observable<List> {
    return this.dataService.get<List>('api/Lists/FirstList', undefined, this.accountService.getHeaders())
      .pipe(tap((list: List) => {
        if (list) {
          this.router.navigate(['account/lists', list.id]);
        }
      }));
  }
}