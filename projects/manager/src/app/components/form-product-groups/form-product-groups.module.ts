import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormProductGroupsComponent } from './form-product-groups.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ListModule } from '../lists/list/list.module';



@NgModule({
  declarations: [FormProductGroupsComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    ListModule
  ],
  exports: [FormProductGroupsComponent]
})
export class FormProductGroupsModule { }
