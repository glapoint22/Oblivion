import { Injectable } from '@angular/core';
import { ListUpdateService } from '../list-update/list-update.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupsService extends ListUpdateService { }