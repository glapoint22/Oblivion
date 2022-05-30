import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupsFormComponent } from './product-groups-form.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ListModule } from '../lists/list/list.module';


@NgModule({
  declarations: [ProductGroupsFormComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    ListModule
  ],
  exports:[ProductGroupsFormComponent]
})
export class ProductGroupsFormModule { }
