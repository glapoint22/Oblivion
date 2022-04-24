import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NicheHierarchyComponent } from './niche-hierarchy.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';
import { IconButtonModule } from '../icon-button/icon-button.module';


@NgModule({
  declarations: [NicheHierarchyComponent],
  imports: [
    CommonModule,
    HierarchyModule,
    MultiColumnListModule,
    IconButtonModule
  ]
})
export class NicheHierarchyModule { }