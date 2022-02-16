import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailBuilderRoutingModule } from './email-builder-routing.module';
import { EmailBuilderComponent } from './email-builder.component';
import { MenuBarModule } from '../../components/menu-bar/menu-bar.module';


@NgModule({
  declarations: [EmailBuilderComponent],
  imports: [
    CommonModule,
    EmailBuilderRoutingModule,
    MenuBarModule
  ]
})
export class EmailBuilderModule { }
