import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListItemComponent } from './editable-list-item.component';



@NgModule({
  declarations: [EditableListItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableListItemComponent]
})
export class EditableListItemModule { }
