import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersFormComponent } from './filters-form.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [FiltersFormComponent],
  imports: [
    CommonModule,
    HierarchyModule,
    IconButtonModule,
    MultiColumnListModule
  ]
})
export class FiltersFormModule { }
