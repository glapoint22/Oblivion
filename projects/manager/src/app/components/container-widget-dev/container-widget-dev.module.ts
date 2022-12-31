import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerWidgetDevComponent } from './container-widget-dev.component';
import { ContainerDevModule } from '../container-dev/container-dev.module';



@NgModule({
  declarations: [
    ContainerWidgetDevComponent
  ],
  imports: [
    CommonModule,
    ContainerDevModule
  ],
  exports: [
    ContainerWidgetDevComponent
  ]
})
export class ContainerWidgetDevModule { }
