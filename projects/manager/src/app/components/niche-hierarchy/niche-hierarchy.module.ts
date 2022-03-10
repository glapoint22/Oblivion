import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NicheHierarchyComponent } from './niche-hierarchy.component';
import { EditableHierarchyModule } from '../hierarchies/editable-hierarchy/editable-hierarchy.module';



@NgModule({
  declarations: [NicheHierarchyComponent],
  imports: [
    CommonModule,
    EditableHierarchyModule
  ],
  exports: [NicheHierarchyComponent]
})
export class NicheHierarchyModule { }
