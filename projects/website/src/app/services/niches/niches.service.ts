import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Niche } from '../../classes/niche';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class NichesService {
  private niches!: Array<Niche>;

  constructor(private dataService: DataService) { }

  getNiches(): Observable<Array<Niche>> {
    if (this.niches) return of(this.niches);

    return this.dataService.get<Array<Niche>>('api/Categories')
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