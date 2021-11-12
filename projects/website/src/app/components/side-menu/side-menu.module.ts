import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { RouterModule } from '@angular/router';
import { AccountListModule } from '../account-list/account-list.module';



@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    AccountListModule,
    RouterModule
  ]
})
export class SideMenuModule { }
