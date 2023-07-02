import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NichesWidgetComponent } from './niches-widget.component';



@NgModule({
  declarations: [
    NichesWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NichesWidgetComponent
  ]
})
export class NichesWidgetModule { }
