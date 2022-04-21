import { Injectable } from '@angular/core';
import { Filter } from '../../classes/filter';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  public filters: Array<Filter> = new Array<Filter>();
}