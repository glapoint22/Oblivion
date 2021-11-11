import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountMenuPopupComponent } from './account-menu-popup.component';
import { AccountModule } from '../account/account.module';



@NgModule({
  declarations: [AccountMenuPopupComponent],
  imports: [
    CommonModule,
    AccountModule
  ]
})
export class AccountMenuPopupModule { }
