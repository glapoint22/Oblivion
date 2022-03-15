import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyItemModule } from '../../items/hierarchy-item/hierarchy-item.module';
import { ListItemModule } from '../../items/list-item/list-item.module';
import { HierarchyComponent } from './hierarchy.component';



@NgModule({
  declarations: [HierarchyComponent],
  imports: [
    CommonModule,
    HierarchyItemModule,
    ListItemModule
  ],
  exports: [HierarchyComponent]
})
export class HierarchyModule { }
