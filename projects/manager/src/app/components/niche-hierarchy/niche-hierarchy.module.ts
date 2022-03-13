import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NicheHierarchyComponent } from './niche-hierarchy.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { CheckboxHierarchyModule } from '../hierarchies/checkbox-hierarchy/checkbox-hierarchy.module';



@NgModule({
  declarations: [NicheHierarchyComponent],
  imports: [
    CommonModule,
    HierarchyModule,
    CheckboxHierarchyModule
  ],
  exports: [NicheHierarchyComponent]
})
export class NicheHierarchyModule { }