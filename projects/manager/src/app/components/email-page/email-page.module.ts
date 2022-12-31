import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailPageComponent } from './email-page.component';
import { ContainerDevModule } from '../container-dev/container-dev.module';
import { RowDevModule } from '../row-dev/row-dev.module';
import { ColumnDevModule } from '../column-dev/column-dev.module';
import { ButtonWidgetDevModule } from '../button-widget-dev/button-widget-dev.module';
import { TextWidgetDevModule } from '../text-widget-dev/text-widget-dev.module';
import { ContainerWidgetDevModule } from '../container-widget-dev/container-widget-dev.module';
import { ImageWidgetDevModule } from '../image-widget-dev/image-widget-dev.module';
import { LineWidgetDevModule } from '../line-widget-dev/line-widget-dev.module';



@NgModule({
  declarations: [
    EmailPageComponent
  ],
  imports: [
    CommonModule,
    ContainerDevModule,
    RowDevModule,
    ColumnDevModule,
    ButtonWidgetDevModule,
    TextWidgetDevModule,
    ContainerWidgetDevModule,
    ImageWidgetDevModule,
    LineWidgetDevModule
  ],
  exports: [
    EmailPageComponent
  ]
})
export class EmailPageModule { }
