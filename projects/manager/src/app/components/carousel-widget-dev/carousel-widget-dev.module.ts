import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselWidgetDevComponent } from './carousel-widget-dev.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'widgets';



@NgModule({
  declarations: [CarouselWidgetDevComponent],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule
  ]
})
export class CarouselWidgetDevModule { }
