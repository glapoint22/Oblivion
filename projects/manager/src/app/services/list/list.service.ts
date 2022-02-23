import { Injectable } from "@angular/core";
import { List } from "../../classes/list";


@Injectable({
  providedIn: 'root'
})
export class ListService {
  public instances: Array<List> = new Array<List>();
}