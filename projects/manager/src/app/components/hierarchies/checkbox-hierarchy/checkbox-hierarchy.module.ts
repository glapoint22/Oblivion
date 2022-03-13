import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxHierarchyComponent } from './checkbox-hierarchy.component';
import { HierarchyItemModule } from '../../items/hierarchy-item/hierarchy-item.module';
import { CheckboxItemModule } from '../../items/checkbox-item/checkbox-item.module';



@NgModule({
  declarations: [CheckboxHierarchyComponent],
  imports: [
    CommonModule,
    HierarchyItemModule,
    CheckboxItemModule
  ],
  exports: [CheckboxHierarchyComponent]
})
export class CheckboxHierarchyModule { }
