import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { EditableListItemModule } from '../../items/editable-list-item/editable-list-item.module';



@NgModule({
  declarations: [EditableListComponent],
  imports: [
    CommonModule,
    EditableListItemModule
  ],
  exports: [EditableListComponent]
})
export class EditableListModule { }
