import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListComponent } from './checkbox-list.component';
import { CheckboxItemModule } from '../../items/checkbox-item/checkbox-item.module';



@NgModule({
  declarations: [CheckboxListComponent],
  imports: [
    CommonModule,
    CheckboxItemModule
  ],
  exports: [
    CheckboxListComponent
  ]
})
export class CheckboxListModule { }
