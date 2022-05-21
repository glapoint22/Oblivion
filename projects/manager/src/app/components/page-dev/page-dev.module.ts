import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDevComponent } from './page-dev.component';
import { RowDevComponent } from '../row-dev/row-dev.component';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';
import { LineWidgetDevComponent } from '../line-widget-dev/line-widget-dev.component';
import { ImageWidgetDevComponent } from '../image-widget-dev/image-widget-dev.component';
import { RouterModule } from '@angular/router';
import { ContainerWidgetDevComponent } from '../container-widget-dev/container-widget-dev.component';
import { VideoWidgetDevComponent } from '../video-widget-dev/video-widget-dev.component';
import { ProductSliderWidgetDevModule } from '../product-slider-widget-dev/product-slider-widget-dev.module';
import { GridWidgetDevModule } from '../grid-widget-dev/grid-widget-dev.module';
import { CarouselWidgetDevComponent } from '../carousel-widget-dev/carousel-widget-dev.component';


@NgModule({
  declarations: [
    PageDevComponent,
    ContainerDevComponent,
    RowDevComponent,
    ColumnDevComponent,
    ButtonWidgetDevComponent,
    TextWidgetDevComponent,
    ContainerWidgetDevComponent,
    ImageWidgetDevComponent,
    LineWidgetDevComponent,
    VideoWidgetDevComponent,
    CarouselWidgetDevComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProductSliderWidgetDevModule,
    GridWidgetDevModule
  ],
  exports: [PageDevComponent]
})
export class PageDevModule { }
