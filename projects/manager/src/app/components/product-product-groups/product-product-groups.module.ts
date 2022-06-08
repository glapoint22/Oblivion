import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductProductGroupsComponent } from './product-product-groups.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { CheckboxListModule } from '../lists/checkbox-list/checkbox-list.module';



@NgModule({
  declarations: [ProductProductGroupsComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CheckboxListModule
  ],
  exports: [
    ProductProductGroupsComponent
  ]
})
export class ProductProductGroupsModule { }
