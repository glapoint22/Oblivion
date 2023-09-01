import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDevComponent } from './page-dev.component';
import { RouterModule } from '@angular/router';
import { VideoWidgetDevComponent } from '../video-widget-dev/video-widget-dev.component';
import { ProductSliderWidgetDevModule } from '../product-slider-widget-dev/product-slider-widget-dev.module';
import { GridWidgetDevModule } from '../grid-widget-dev/grid-widget-dev.module';
import { CarouselWidgetDevComponent } from '../carousel-widget-dev/carousel-widget-dev.component';
import { ContainerDevModule } from '../container-dev/container-dev.module';
import { RowDevModule } from '../row-dev/row-dev.module';
import { ColumnDevModule } from '../column-dev/column-dev.module';
import { ButtonWidgetDevModule } from '../button-widget-dev/button-widget-dev.module';
import { TextWidgetDevModule } from '../text-widget-dev/text-widget-dev.module';
import { ContainerWidgetDevModule } from '../container-widget-dev/container-widget-dev.module';
import { ImageWidgetDevModule } from '../image-widget-dev/image-widget-dev.module';
import { LineWidgetDevModule } from '../line-widget-dev/line-widget-dev.module';
import { NichesWidgetDevComponent } from '../niches-widget-dev/niches-widget-dev.component';
import { PosterWidgetDevModule } from '../poster-widget-dev/poster-widget-dev.module';
import { ImageSetWidgetDevComponent } from '../image-set-widget-dev/image-set-widget-dev.component';


@NgModule({
  declarations: [
    PageDevComponent,
    VideoWidgetDevComponent,
    CarouselWidgetDevComponent,
    NichesWidgetDevComponent,
    ImageSetWidgetDevComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProductSliderWidgetDevModule,
    GridWidgetDevModule,
    ContainerDevModule,
    RowDevModule,
    ColumnDevModule,
    ButtonWidgetDevModule,
    TextWidgetDevModule,
    ContainerWidgetDevModule,
    ImageWidgetDevModule,
    LineWidgetDevModule,
    PosterWidgetDevModule,
  ],
  exports: [PageDevComponent]
})
export class PageDevModule { }
