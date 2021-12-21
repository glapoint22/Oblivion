import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselWidgetComponent } from './carousel-widget.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from '../../directives/carousel/carousel.module';



@NgModule({
  declarations: [CarouselWidgetComponent],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule
  ],
  exports: [CarouselWidgetComponent]
})
export class CarouselWidgetModule { }
