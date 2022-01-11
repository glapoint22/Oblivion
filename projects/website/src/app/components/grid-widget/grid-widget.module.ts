import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './grid-widget.component';
import { PaginatorModule } from '../paginator/paginator.module';
import { ProductThumbnailModule } from '../product-thumbnail/product-thumbnail.module';
import { FiltersPanelModule } from '../filters-panel/filters-panel.module';



@NgModule({
  declarations: [GridWidgetComponent],
  imports: [
    CommonModule,
    PaginatorModule,
    ProductThumbnailModule,
    FiltersPanelModule
  ],
  exports: [GridWidgetComponent]
})
export class GridWidgetModule { }
