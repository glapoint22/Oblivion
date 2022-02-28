import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableCheckboxListComponent } from './editable-checkbox-list.component';
import { EditableCheckboxItemComponent } from '../../items/editable-checkbox-item/editable-checkbox-item.component';



@NgModule({
  declarations: [EditableCheckboxListComponent, EditableCheckboxItemComponent],
  imports: [
    CommonModule
  ],
  exports:[EditableCheckboxListComponent]
})
export class EditableCheckboxListModule { }
