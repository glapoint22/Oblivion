import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountListComponent } from './account-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AccountListComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [AccountListComponent]
})
export class AccountListModule { }
