import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountFormComponent } from './create-account-form.component';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CreateAccountFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule,
    RouterModule
  ]
})
export class CreateAccountFormModule { }
