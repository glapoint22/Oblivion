import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { DataService } from 'common';
import { Observable } from 'rxjs';
import { PageContent, PageType } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<PageContent> {

  constructor(private dataService: DataService) { }

  resolve(): Observable<PageContent> {
    return this.dataService.get<PageContent>('api/Pages/PageType', [{
      key: 'pageType',
      value: PageType.Home
    }]);
  }
}