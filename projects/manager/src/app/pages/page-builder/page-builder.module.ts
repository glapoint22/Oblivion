import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { PageBuilderComponent } from './page-builder.component';


@NgModule({
  declarations: [PageBuilderComponent],
  imports: [
    CommonModule,
    PageBuilderRoutingModule
  ]
})
export class PageBuilderModule { }
