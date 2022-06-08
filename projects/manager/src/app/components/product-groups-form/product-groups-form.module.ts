import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupsFormComponent } from './product-groups-form.component';
import { FormProductGroupsModule } from '../form-product-groups/form-product-groups.module';


@NgModule({
  declarations: [ProductGroupsFormComponent],
  imports: [
    CommonModule,
    FormProductGroupsModule
  ],
  exports:[ProductGroupsFormComponent]
})
export class ProductGroupsFormModule { }
