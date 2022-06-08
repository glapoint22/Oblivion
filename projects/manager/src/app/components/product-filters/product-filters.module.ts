import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFiltersComponent } from './product-filters.component';
import { CheckboxHierarchyModule } from '../hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { CheckboxMultiColumnListModule } from '../lists/checkbox-multi-column-list/checkbox-multi-column-list.module';



@NgModule({
  declarations: [ProductFiltersComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CheckboxHierarchyModule,
    CheckboxMultiColumnListModule
  ],
  exports: [
    ProductFiltersComponent
  ]
})
export class ProductFiltersModule { }
