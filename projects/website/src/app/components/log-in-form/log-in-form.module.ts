import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInFormComponent } from './log-in-form.component';
import { ExternalLoginProvidersModule } from '../external-login-providers/external-login-providers.module';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LogInFormComponent],
  imports: [
    CommonModule,
    ExternalLoginProvidersModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class LogInFormModule { }
