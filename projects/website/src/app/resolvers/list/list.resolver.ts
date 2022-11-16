import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from 'common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ListPageData } from '../../classes/list-page-data';

@Injectable({
  providedIn: 'root'
})
export class ListResolver implements Resolve<ListPageData> {
  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListPageData> {
    // Get the listid from the url
    const listId = route.paramMap.get('listId');
    const sort = route.queryParamMap.get('sort');

    return this.dataService.get<ListPageData>('api/Lists/GetLists', [
      {
        key: 'listId',
        value: listId ? listId : ''
      },
      {
        key: 'sort',
        value: sort ? sort : ''
      }
    ], { authorization: true })
      .pipe(
        tap((listPageData: ListPageData) => {
          if (listPageData) {
            listPageData.selectedList = listId ? listPageData.lists.find(x => x.id == listId)! : listPageData.lists[0];

            // If we don't have a list id, add the selected list id to the url
            if (!listId) {
              window.setTimeout(() => {
                let url = state.url + '/' + listPageData.selectedList.id;
                this.location.replaceState(url);
              });
            }
          }

        }),
        catchError(this.handleError(state))
      );
  }


  handleError(state: RouterStateSnapshot) {
    return (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.router.navigate(['**'], { skipLocationChange: true });
        this.location.replaceState(state.url);
      }
      return throwError(() => error);
    }
  }
}