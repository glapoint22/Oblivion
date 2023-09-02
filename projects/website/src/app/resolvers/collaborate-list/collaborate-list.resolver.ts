import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from 'common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborateListResolver  {

  constructor(private dataService: DataService, private router: Router, private location: Location) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.dataService.get(
      'api/Lists/ListInfo',
      [{ key: 'collaborateId', value: route.paramMap.get('collaborateListId') }],
      { authorization: true }
    ).pipe(
      tap((listInfo: any) => {

        // If user is already collaborating on this list, navigate to the list page
        if (listInfo.isCollaborator) this.router.navigate(['account', 'lists', listInfo.listId]);
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