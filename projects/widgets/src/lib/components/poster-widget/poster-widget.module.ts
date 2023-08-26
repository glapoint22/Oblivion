import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterWidgetComponent } from './poster-widget.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PosterWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PosterWidgetComponent
  ]
})
export class PosterWidgetModule { }
