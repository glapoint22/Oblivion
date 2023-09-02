import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from 'common';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PageContent } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class CustomPageResolver  {

  constructor
    (
      private dataService: DataService,
      private router: Router,
      private location: Location
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageContent> {
    const id = route.paramMap.get('id');

    // Return the page
    if (id) {
      return this.dataService.get<PageContent>('api/Pages/PageId', [
        {
          key: 'id',
          value: id
        }
      ]).pipe(
        catchError<PageContent, Observable<PageContent>>(this.handleError(state))
      );
    } else {
      this.router.navigate(['**'], { skipLocationChange: true });
      this.location.replaceState(state.url);
      return of();
    }
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