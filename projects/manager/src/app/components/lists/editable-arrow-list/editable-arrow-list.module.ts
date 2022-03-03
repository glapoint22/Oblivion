import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableArrowListComponent } from './editable-arrow-list.component';
import { EditableArrowItemModule } from '../../items/editable-arrow-item/editable-arrow-item.module';



@NgModule({
  declarations: [EditableArrowListComponent],
  imports: [
    CommonModule,
    EditableArrowItemModule
  ],
  exports:[EditableArrowListComponent]
})
export class EditableArrowListModule { }
