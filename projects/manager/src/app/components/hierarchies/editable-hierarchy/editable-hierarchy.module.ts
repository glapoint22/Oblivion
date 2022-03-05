import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableHierarchyComponent } from './editable-hierarchy.component';
import { EditableArrowItemModule } from '../../items/editable-arrow-item/editable-arrow-item.module';
import { EditableItemModule } from '../../items/editable-item/editable-item.module';



@NgModule({
  declarations: [EditableHierarchyComponent],
  imports: [
    CommonModule,
    EditableArrowItemModule,
    EditableItemModule
  ],
  exports: [EditableHierarchyComponent]
})
export class EditableHierarchyModule { }
