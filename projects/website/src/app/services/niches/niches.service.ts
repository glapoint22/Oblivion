import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Category } from '../../classes/category';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class NichesService {
  private niches!: Array<Category>;

  constructor(private dataService: DataService) { }

  getNiches(): Observable<Array<Category>> {
    if (this.niches) return of(this.niches);

    return this.dataService.get<Array<Category>>('api/Categories')
      .pipe(tap(niches => {
        this.niches = niches;
        this.niches.unshift({
          name: 'All Niches',
          urlName: '',
          urlId: 'all'
        });
      }));
  }
}