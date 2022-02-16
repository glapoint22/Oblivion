import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDevComponent } from './page-dev.component';
import { RowDevComponent } from '../row-dev/row-dev.component';
import { ContainerDevComponent } from '../container-dev/container-dev.component';
import { ColumnDevComponent } from '../column-dev/column-dev.component';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';



@NgModule({
  declarations: [
    PageDevComponent,
    ContainerDevComponent,
    RowDevComponent,
    ColumnDevComponent,
    ButtonWidgetDevComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [PageDevComponent]
})
export class PageDevModule { }
