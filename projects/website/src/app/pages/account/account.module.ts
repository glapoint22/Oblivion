import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    HeaderFooterModule,
    RouterModule
  ]
})
export class AccountModule { }
