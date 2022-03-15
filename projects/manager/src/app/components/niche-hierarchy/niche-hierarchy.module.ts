import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NicheHierarchyComponent } from './niche-hierarchy.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';


@NgModule({
  declarations: [NicheHierarchyComponent],
  imports: [
    CommonModule,
    HierarchyModule
  ],
  exports: [NicheHierarchyComponent]
})
export class NicheHierarchyModule { }