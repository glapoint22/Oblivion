import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'profile',
    loadChildren: () => import('../../pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'email-preferences',
    loadChildren: () => import('../../pages/email-preferences/email-preferences.module').then(m => m.EmailPreferencesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
