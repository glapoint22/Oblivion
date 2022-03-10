import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableHierarchyComponent } from './editable-hierarchy.component';
import { EditableHierarchyItemModule } from '../../items/editable-hierarchy-item/editable-hierarchy-item.module';
import { EditableListItemModule } from '../../items/editable-list-item/editable-list-item.module';



@NgModule({
  declarations: [EditableHierarchyComponent],
  imports: [
    CommonModule,
    EditableHierarchyItemModule,
    EditableListItemModule
  ],
  exports: [EditableHierarchyComponent]
})
export class EditableHierarchyModule { }
