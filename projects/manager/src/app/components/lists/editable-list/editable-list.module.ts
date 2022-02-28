import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { EditableItemComponent } from '../../items/editable-item/editable-item.component';



@NgModule({
  declarations: [EditableListComponent, EditableItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableListComponent]
})
export class EditableListModule { }
