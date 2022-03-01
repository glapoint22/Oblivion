import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { EditableItemModule } from '../../items/editable-item/editable-item.module';



@NgModule({
  declarations: [EditableListComponent],
  imports: [
    CommonModule,
    EditableItemModule
  ],
  exports: [EditableListComponent]
})
export class EditableListModule { }
