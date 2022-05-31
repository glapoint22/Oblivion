import { Injectable } from '@angular/core';
import { NewListUpdateService } from '../new-list-update/new-list-update.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupsService extends NewListUpdateService { }