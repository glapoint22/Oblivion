import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowListComponent } from './arrow-list.component';
import { HierarchyItemModule } from '../../items/hierarchy-item/hierarchy-item.module';



@NgModule({
  declarations: [ArrowListComponent],
  imports: [
    CommonModule,
    HierarchyItemModule
  ],
  exports: [ArrowListComponent]
})
export class ArrowListModule { }
