import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpFormComponent } from './sign-up-form.component';
import { ExternalLoginProvidersModule } from '../external-login-providers/external-login-providers.module';



@NgModule({
  declarations: [SignUpFormComponent],
  imports: [
    CommonModule,
    ExternalLoginProvidersModule
  ]
})
export class SignUpFormModule { }
