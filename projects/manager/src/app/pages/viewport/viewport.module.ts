import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewportRoutingModule } from './viewport-routing.module';
import { ViewportComponent } from './viewport.component';
import { PageDevModule } from '../../components/page-dev/page-dev.module';


@NgModule({
  declarations: [ViewportComponent],
  imports: [
    CommonModule,
    ViewportRoutingModule,
    PageDevModule
  ]
})
export class ViewportModule { }
