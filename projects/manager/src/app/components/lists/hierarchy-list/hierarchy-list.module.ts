import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyListComponent } from './hierarchy-list.component';
import { HierarchyItemModule } from '../../items/hierarchy-item/hierarchy-item.module';



@NgModule({
  declarations: [HierarchyListComponent],
  imports: [
    CommonModule,
    HierarchyItemModule
  ],
  exports: [HierarchyListComponent]
})
export class HierarchyListModule { }
