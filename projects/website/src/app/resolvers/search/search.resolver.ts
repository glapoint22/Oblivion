import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot} from '@angular/router';
import { DataService } from 'common';
import { Observable } from 'rxjs';
import { QueryParams } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class SearchResolver implements Resolve<any> {
  public currentSearch!: string | null;

  constructor(private dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const search = route.queryParamMap.get('search');
    const queryParams = new QueryParams();

    queryParams.set(route.queryParamMap);

    if (search && search != this.currentSearch) {
      this.currentSearch = search;

      // Return the page
      return this.dataService.post('api/Pages/Search', queryParams)
    } else {

      // Return the grid data
      return this.dataService.post('api/Pages/GridData', queryParams);
    }
  }
}