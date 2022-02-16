import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyComponent } from './hierarchy.component';
import { HierarchyItemModule } from './hierarchy-item/hierarchy-item.module';



@NgModule({
  declarations: [
    HierarchyComponent
  ],
  imports: [
    CommonModule,
    HierarchyItemModule
  ],
  exports:[
    HierarchyComponent
  ]
})
export class HierarchyModule { }
