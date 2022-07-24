import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupsPopupComponent } from './product-groups-popup.component';
import { ProductProductGroupsModule } from '../product-product-groups/product-product-groups.module';



@NgModule({
  declarations: [ProductGroupsPopupComponent],
  imports: [
    CommonModule,
    ProductProductGroupsModule
  ],
  exports: [
    ProductGroupsPopupComponent
  ]
})
export class ProductGroupsPopupModule { }
