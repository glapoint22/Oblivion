import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageRoutingModule } from './about-page-routing.module';
import { AboutPageComponent } from './about-page.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [AboutPageComponent],
  imports: [
    CommonModule,
    AboutPageRoutingModule,
    HeaderFooterModule
  ]
})
export class AboutPageModule { }
