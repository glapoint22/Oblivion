import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListItemComponent } from './checkbox-list-item.component';



@NgModule({
  declarations: [CheckboxListItemComponent],
  imports: [
    CommonModule
  ],
  exports: [CheckboxListItemComponent]
})
export class CheckboxListItemModule { }
