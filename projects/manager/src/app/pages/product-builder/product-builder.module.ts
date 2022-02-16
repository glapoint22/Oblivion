import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductBuilderRoutingModule } from './product-builder-routing.module';
import { ProductBuilderComponent } from './product-builder.component';
import { ProductPropertiesModule } from '../../components/product-properties/product-properties.module';
import { ProductHierarchyModule } from '../../components/product-hierarchy/product-hierarchy.module';


@NgModule({
  declarations: [
    ProductBuilderComponent
  ],
  imports: [
    CommonModule,
    ProductBuilderRoutingModule,
    ProductPropertiesModule,
    ProductHierarchyModule
  ]
})
export class ProductBuilderModule { }