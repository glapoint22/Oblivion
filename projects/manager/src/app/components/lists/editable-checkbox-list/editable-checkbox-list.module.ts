import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableCheckboxListComponent } from './editable-checkbox-list.component';
import { EditableCheckboxItemModule } from '../../items/editable-checkbox-item/editable-checkbox-item.module';



@NgModule({
  declarations: [EditableCheckboxListComponent],
  imports: [
    CommonModule,
    EditableCheckboxItemModule
  ],
  exports:[EditableCheckboxListComponent]
})
export class EditableCheckboxListModule { }
