import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductBuilderRoutingModule } from './product-builder-routing.module';
import { ProductBuilderComponent } from './product-builder.component';


@NgModule({
  declarations: [ProductBuilderComponent],
  imports: [
    CommonModule,
    ProductBuilderRoutingModule
  ]
})
export class ProductBuilderModule { }
