import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableItemComponent } from './editable-item.component';



@NgModule({
  declarations: [EditableItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableItemComponent]
})
export class EditableItemModule { }
