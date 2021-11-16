import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailVerificationFormComponent } from './email-verification-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';



@NgModule({
  declarations: [EmailVerificationFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class EmailVerificationFormModule { }
