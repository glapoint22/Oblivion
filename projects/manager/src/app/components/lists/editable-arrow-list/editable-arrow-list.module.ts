import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableArrowListComponent } from './editable-arrow-list.component';
import { EditableHierarchyItemModule } from '../../items/editable-hierarchy-item/editable-hierarchy-item.module';



@NgModule({
  declarations: [EditableArrowListComponent],
  imports: [
    CommonModule,
    EditableHierarchyItemModule
  ],
  exports:[EditableArrowListComponent]
})
export class EditableArrowListModule { }
