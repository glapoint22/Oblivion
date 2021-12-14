import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductThumbnailComponent } from './product-thumbnail.component';
import { StarsModule } from '../stars/stars.module';
import { StarsSummaryModule } from '../stars-summary/stars-summary.module';



@NgModule({
  declarations: [ProductThumbnailComponent],
  imports: [
    CommonModule,
    StarsSummaryModule
  ],
  exports: [ProductThumbnailComponent]
})
export class ProductThumbnailModule { }
