import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductBuilderRoutingModule } from './product-builder-routing.module';
import { ProductBuilderComponent } from './product-builder.component';
import { MenuBarModule } from '../../components/menu-bar/menu-bar.module';


@NgModule({
  declarations: [ProductBuilderComponent],
  imports: [
    CommonModule,
    ProductBuilderRoutingModule,
    MenuBarModule
  ]
})
export class ProductBuilderModule { }
