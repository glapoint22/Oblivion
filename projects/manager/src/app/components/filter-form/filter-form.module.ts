import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterFormComponent } from './filter-form.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';



@NgModule({
  declarations: [FilterFormComponent],
  imports: [
    CommonModule,
    HierarchyModule
  ]
})
export class FilterFormModule { }
