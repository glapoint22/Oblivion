import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxMultiColumnItemComponent } from './checkbox-multi-column-item.component';



@NgModule({
  declarations: [CheckboxMultiColumnItemComponent],
  imports: [
    CommonModule
  ],
  exports:[CheckboxMultiColumnItemComponent]
})
export class CheckboxMultiColumnItemModule { }
