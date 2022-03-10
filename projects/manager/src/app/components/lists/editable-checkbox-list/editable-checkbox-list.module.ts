import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableCheckboxListComponent } from './editable-checkbox-list.component';
import { EditableCheckboxListItemModule } from '../../items/editable-checkbox-list-item/editable-checkbox-list-item.module';



@NgModule({
  declarations: [EditableCheckboxListComponent],
  imports: [
    CommonModule,
    EditableCheckboxListItemModule
  ],
  exports:[EditableCheckboxListComponent]
})
export class EditableCheckboxListModule { }
