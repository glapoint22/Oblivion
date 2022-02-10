import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailBuilderRoutingModule } from './email-builder-routing.module';
import { EmailBuilderComponent } from './email-builder.component';


@NgModule({
  declarations: [EmailBuilderComponent],
  imports: [
    CommonModule,
    EmailBuilderRoutingModule
  ]
})
export class EmailBuilderModule { }
