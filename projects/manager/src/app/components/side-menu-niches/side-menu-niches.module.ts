import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuNichesComponent } from './side-menu-niches.component';
import { HierarchyModule } from '../hierarchies/hierarchy/hierarchy.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { MultiColumnListModule } from '../lists/multi-column-list/multi-column-list.module';



@NgModule({
  declarations: [SideMenuNichesComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    HierarchyModule,
    MultiColumnListModule
  ],
  exports:[
    SideMenuNichesComponent
  ]
})
export class SideMenuNichesModule { }
