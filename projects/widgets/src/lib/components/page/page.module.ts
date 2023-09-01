import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { ContainerComponent } from '../container/container.component';
import { RowComponent } from '../row/row.component';
import { ColumnComponent } from '../column/column.component';
import { ButtonWidgetComponent } from '../button-widget/button-widget.component';
import { TextWidgetComponent } from '../text-widget/text-widget.component';
import { ContainerWidgetComponent } from '../container-widget/container-widget.component';
import { RouterModule } from '@angular/router';
import { ImageWidgetComponent } from '../image-widget/image-widget.component';
import { LineWidgetComponent } from '../line-widget/line-widget.component';
import { VideoWidgetComponent } from '../video-widget/video-widget.component';
import { ProductSliderWidgetModule } from '../product-slider-widget/product-slider-widget.module';
import { CarouselWidgetModule } from '../carousel-widget/carousel-widget.module';
import { GridWidgetModule } from '../grid-widget/grid-widget.module';
import { NichesWidgetModule } from '../niches-widget/niches-widget.module';
import { PosterWidgetModule } from '../poster-widget/poster-widget.module';
import { ImageSetWidgetModule } from '../image-set-widget/image-set-widget.module';



@NgModule({
  declarations: [
    PageComponent,
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    ButtonWidgetComponent,
    TextWidgetComponent,
    ContainerWidgetComponent,
    ImageWidgetComponent,
    LineWidgetComponent,
    VideoWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProductSliderWidgetModule,
    CarouselWidgetModule,
    GridWidgetModule,
    NichesWidgetModule,
    PosterWidgetModule,
    ImageSetWidgetModule
  ],
  exports: [PageComponent]
})
export class PageModule { }
