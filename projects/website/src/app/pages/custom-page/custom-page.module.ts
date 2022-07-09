import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomPageRoutingModule } from './custom-page-routing.module';
import { CustomPageComponent } from './custom-page.component';
import { PageModule } from 'widgets';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [CustomPageComponent],
  imports: [
    CommonModule,
    CustomPageRoutingModule,
    PageModule,
    HeaderFooterModule
  ]
})
export class CustomPageModule { }
