import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableArrowListComponent } from './editable-arrow-list.component';
import { EditableArrowItemComponent } from '../../items/editable-arrow-item/editable-arrow-item.component';



@NgModule({
  declarations: [EditableArrowListComponent, EditableArrowItemComponent],
  imports: [
    CommonModule
  ],
  exports:[EditableArrowListComponent]
})
export class EditableArrowListModule { }
