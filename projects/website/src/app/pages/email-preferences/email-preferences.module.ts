import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailPreferencesRoutingModule } from './email-preferences-routing.module';
import { EmailPreferencesComponent } from './email-preferences.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';


@NgModule({
  declarations: [EmailPreferencesComponent],
  imports: [
    CommonModule,
    EmailPreferencesRoutingModule,
    HeaderFooterModule
  ]
})
export class EmailPreferencesModule { }
