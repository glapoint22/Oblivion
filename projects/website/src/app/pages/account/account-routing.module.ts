import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListResolver } from '../../guards/list/list.resolver';
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
  },
  {
    path: 'lists',
    loadChildren: () => import('../../pages/lists/lists.module').then(m => m.ListsModule),
    resolve: {
      lists: ListResolver
    }
  },
  {
    path: 'lists/:listId',
    loadChildren: () => import('../../pages/lists/lists.module').then(m => m.ListsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
