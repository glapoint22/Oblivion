import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountMenuPopupComponent } from './account-menu-popup.component';
import { AccountListModule } from '../account-list/account-list.module';



@NgModule({
  declarations: [AccountMenuPopupComponent],
  imports: [
    CommonModule,
    AccountListModule
  ]
})
export class AccountMenuPopupModule { }
