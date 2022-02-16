import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHierarchyComponent } from './product-hierarchy.component';
import { HierarchyModule } from '../hierarchy/hierarchy.module';



@NgModule({
  declarations: [ProductHierarchyComponent],
  imports: [
    CommonModule,
    HierarchyModule
  ],
  exports: [ProductHierarchyComponent]
})
export class ProductHierarchyModule { }