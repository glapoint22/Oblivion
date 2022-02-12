import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './grid-widget.component';
import { FiltersPanelModule } from '../filters-panel/filters-panel.module';
import { RouterModule } from '@angular/router';
import { DropdownModule, PaginatorModule } from 'common';
import { ProductSummaryModule } from '../product-summary/product-summary.module';



@NgModule({
  declarations: [GridWidgetComponent],
  imports: [
    CommonModule,
    PaginatorModule,
    ProductSummaryModule,
    FiltersPanelModule,
    DropdownModule,
    RouterModule
  ],
  exports: [GridWidgetComponent]
})
export class GridWidgetModule { }
