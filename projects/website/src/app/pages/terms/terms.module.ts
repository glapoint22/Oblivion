import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    TermsRoutingModule,
    HeaderFooterModule,
    RouterModule
  ]
})
export class TermsModule { }
