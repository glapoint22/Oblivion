import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookiesPolicyRoutingModule } from './cookies-policy-routing.module';
import { CookiesPolicyComponent } from './cookies-policy.component';
import { RouterModule } from '@angular/router';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [CookiesPolicyComponent],
  imports: [
    CommonModule,
    CookiesPolicyRoutingModule,
    HeaderFooterModule,
    RouterModule
  ]
})
export class CookiesPolicyModule { }
