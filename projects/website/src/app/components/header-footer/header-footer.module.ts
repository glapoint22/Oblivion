import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderFooterComponent } from './header-footer.component';
import { RouterModule } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderFooterComponent,
    MessageComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderFooterComponent
  ]
})
export class HeaderFooterModule { }
