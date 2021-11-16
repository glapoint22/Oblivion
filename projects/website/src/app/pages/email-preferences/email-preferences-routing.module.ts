import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailPreferencesComponent } from './email-preferences.component';

const routes: Routes = [
  {
    path: '',
    component: EmailPreferencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailPreferencesRoutingModule { }
