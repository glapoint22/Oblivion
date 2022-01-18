import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteAccountFormComponent } from './delete-account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';



@NgModule({
  declarations: [DeleteAccountFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class DeleteAccountFormModule { }