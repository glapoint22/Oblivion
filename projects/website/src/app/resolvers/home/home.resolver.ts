import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable } from 'rxjs';
import { Page } from '../../classes/page';
import { DataService } from '../../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<Page> {

  constructor(private dataService: DataService) { }

  resolve(): Observable<Page> {
    return this.dataService.get<Page>('api/Home');
  }
}