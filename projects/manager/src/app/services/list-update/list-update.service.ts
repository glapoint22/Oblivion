import { Injectable } from '@angular/core';
import { ListItem } from '../../classes/list-item';

@Injectable({
  providedIn: 'root'
})
export class ListUpdateService {
  public formArray: Array<ListItem> = new Array<ListItem>();
  public otherSearchList: Array<ListItem> = new Array<ListItem>();
  public productArray: Array<ListItem> = new Array<ListItem>();
  public productSearchList: Array<ListItem> = new Array<ListItem>();
}