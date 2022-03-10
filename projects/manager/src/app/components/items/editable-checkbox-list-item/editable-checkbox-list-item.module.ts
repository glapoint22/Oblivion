import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableCheckboxListItemComponent } from './editable-checkbox-list-item.component';



@NgModule({
  declarations: [EditableCheckboxListItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableCheckboxListItemComponent]
})
export class EditableCheckboxListItemModule { }
