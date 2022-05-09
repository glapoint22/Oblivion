import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetDevComponent } from './grid-widget-dev.component';
import { DropdownModule, PaginatorModule } from 'common';
import { FiltersPanelModule, ProductSummaryModule } from 'widgets';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [GridWidgetDevComponent],
  imports: [
    CommonModule,
    PaginatorModule,
    ProductSummaryModule,
    FiltersPanelModule,
    DropdownModule,
    RouterModule
  ]
})
export class GridWidgetDevModule { }
