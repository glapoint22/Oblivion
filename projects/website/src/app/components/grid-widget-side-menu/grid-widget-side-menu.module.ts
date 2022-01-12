import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetSideMenuComponent } from './grid-widget-side-menu.component';
import { FiltersPanelModule } from '../filters-panel/filters-panel.module';
import { FilterContainerModule } from '../filter-container/filter-container.module';



@NgModule({
  declarations: [GridWidgetSideMenuComponent],
  imports: [
    CommonModule,
    FiltersPanelModule,
    FilterContainerModule
  ]
})
export class GridWidgetSideMenuModule { }
