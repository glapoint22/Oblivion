import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GridData } from '../../classes/grid-data';

@Injectable({
  providedIn: 'root'
})
export class GridWidgetService {
  public gridData: Subject<GridData> = new Subject<GridData>();
}