import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateAccountFormComponent } from './activate-account-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ActivateAccountFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ActivateAccountFormModule { }
