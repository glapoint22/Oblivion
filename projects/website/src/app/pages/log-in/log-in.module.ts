import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogInRoutingModule } from './log-in-routing.module';
import { LogInComponent } from './log-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExternalLoginProvidersModule } from '../../components/external-login-providers/external-login-providers.module';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';


@NgModule({
  declarations: [LogInComponent],
  imports: [
    CommonModule,
    LogInRoutingModule,
    ExternalLoginProvidersModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class LogInModule { }
