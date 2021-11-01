import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePasswordFormComponent } from './create-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';



@NgModule({
  declarations: [CreatePasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class CreatePasswordFormModule { }
