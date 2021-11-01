import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';



@NgModule({
  declarations: [ChangePasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class ChangePasswordFormModule { }
