import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxItemComponent } from './checkbox-item.component';



@NgModule({
  declarations: [CheckboxItemComponent],
  imports: [
    CommonModule
  ],
  exports: [CheckboxItemComponent]
})
export class CheckboxItemModule { }
