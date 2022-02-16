import { Injectable } from '@angular/core';
import { DataService } from 'common';
import { Observable, of, tap } from 'rxjs';
import { Niche } from '../../classes/niche';

@Injectable({
  providedIn: 'root'
})
export class NichesService {
  private niches!: Array<Niche>;
  public allNiche: Niche = {
    id: 0,
    name: 'All Niches',
    urlName: '',
    urlId: 'all'
  }

  constructor(private dataService: DataService) { }

  getNiches(): Observable<Array<Niche>> {
    if (this.niches) {
      return of(this.niches);
    }

    return this.dataService.get<Array<Niche>>('api/Categories')
      .pipe(tap(niches => {
        this.niches = niches;
        this.niches.unshift(this.allNiche);
      }));
  }
}