import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupsPropertyComponent } from './product-groups-property.component';
import { ProductProductGroupsModule } from '../../product-product-groups/product-product-groups.module';



@NgModule({
  declarations: [ProductGroupsPropertyComponent],
  imports: [
    CommonModule
  ]
})
export class ProductGroupsPropertyModule { }
