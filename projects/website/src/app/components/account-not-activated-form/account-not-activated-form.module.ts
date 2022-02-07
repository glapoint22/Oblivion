import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountNotActivatedFormComponent } from './account-not-activated-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AccountNotActivatedFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AccountNotActivatedFormModule { }
