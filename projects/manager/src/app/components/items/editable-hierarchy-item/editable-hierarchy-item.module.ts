import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableHierarchyItemComponent } from './editable-hierarchy-item.component';



@NgModule({
  declarations: [EditableHierarchyItemComponent],
  imports: [
    CommonModule
  ],
  exports: [EditableHierarchyItemComponent]
})
export class EditableHierarchyItemModule { }