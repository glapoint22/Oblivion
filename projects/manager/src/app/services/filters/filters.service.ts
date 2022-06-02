import { Injectable } from '@angular/core';
import { HierarchyUpdateService } from '../hierarchy-update/hierarchy-update.service';

@Injectable({
  providedIn: 'root'
})
export class FiltersService extends HierarchyUpdateService { }