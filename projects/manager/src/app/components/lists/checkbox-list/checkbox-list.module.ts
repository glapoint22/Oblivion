import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListComponent } from './checkbox-list.component';
import { CheckboxItemComponent } from '../../items/checkbox-item/checkbox-item.component';



@NgModule({
  declarations: [CheckboxListComponent, CheckboxItemComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CheckboxListComponent
  ]
})
export class CheckboxListModule { }
