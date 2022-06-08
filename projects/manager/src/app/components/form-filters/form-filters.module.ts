import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFiltersComponent } from './form-filters.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [FormFiltersComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    HierarchyModule,
    MultiColumnListModule
  ],
  exports: [
    FormFiltersComponent
  ]
})
export class FormFiltersModule { }