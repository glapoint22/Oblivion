import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableCheckboxItemComponent } from './editable-checkbox-item.component';



@NgModule({
  declarations: [EditableCheckboxItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableCheckboxItemComponent]
})
export class EditableCheckboxItemModule { }
