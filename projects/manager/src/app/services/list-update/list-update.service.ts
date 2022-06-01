import { Injectable } from '@angular/core';
import { SortType } from '../../classes/enums';
import { ListItem } from '../../classes/list-item';
import { ListComponent } from '../../components/lists/list/list.component';

@Injectable({
  providedIn: 'root'
})
export class ListUpdateService {
  public formArray: Array<ListItem> = new Array<ListItem>();
  public formSearchList: Array<ListItem> = new Array<ListItem>();
  public productArray: Array<ListItem> = new Array<ListItem>();
  public productSearchList: Array<ListItem> = new Array<ListItem>();
  public otherSortList: Array<ListItem> = new Array<ListItem>();
  public formListComponent!: ListComponent;
  public productListComponent!: ListComponent;
  public targetSortType!: SortType;
}
