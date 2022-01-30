import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './grid-widget.component';
import { PaginatorModule } from '../paginator/paginator.module';
import { ProductThumbnailModule } from '../product-thumbnail/product-thumbnail.module';
import { FiltersPanelModule } from '../filters-panel/filters-panel.module';
import { DropdownModule } from '../dropdown/dropdown.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [GridWidgetComponent],
  imports: [
    CommonModule,
    PaginatorModule,
    ProductThumbnailModule,
    FiltersPanelModule,
    DropdownModule,
    RouterModule
  ],
  exports: [GridWidgetComponent]
})
export class GridWidgetModule { }
