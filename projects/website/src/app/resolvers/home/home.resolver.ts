import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { DataService } from 'common';
import { Observable } from 'rxjs';
import { Page } from 'widgets';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<Page> {

  constructor(private dataService: DataService) { }

  resolve(): Observable<Page> {
    return this.dataService.get<Page>('api/Home');
  }
}