import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { AccountModule } from '../account/account.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    AccountModule,
    RouterModule
  ]
})
export class SideMenuModule { }
