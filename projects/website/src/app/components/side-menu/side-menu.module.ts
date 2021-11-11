import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { AccountModule } from '../account/account.module';



@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    AccountModule
  ]
})
export class SideMenuModule { }
