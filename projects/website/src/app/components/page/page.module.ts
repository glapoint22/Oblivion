import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { ContainerComponent } from '../container/container.component';
import { RowComponent } from '../row/row.component';
import { ColumnComponent } from '../column/column.component';
import { ButtonWidgetComponent } from '../button-widget/button-widget.component';



@NgModule({
  declarations: [
    PageComponent,
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    ButtonWidgetComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [PageComponent]
})
export class PageModule { }
