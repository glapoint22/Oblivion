import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailPreferencesRoutingModule } from './email-preferences-routing.module';
import { EmailPreferencesComponent } from './email-preferences.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { EmailPreferenceComponent } from './components/email-preference/email-preference.component';


@NgModule({
  declarations: [
    EmailPreferencesComponent,
    EmailPreferenceComponent
  ],
  imports: [
    CommonModule,
    EmailPreferencesRoutingModule,
    HeaderFooterModule
  ]
})
export class EmailPreferencesModule { }
