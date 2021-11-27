import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountGuard } from './guards/account/account.guard';
import { SharedListResolver } from './guards/shared-list/shared-list.resolver';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
    canLoad: [AccountGuard],
    canActivate: [AccountGuard]
  },
  {
    path: 'collaborate-list/:collaborateListId',
    loadChildren: () => import('./pages/collaborate-list/collaborate-list.module').then(m => m.CollaborateListModule),
    canLoad: [AccountGuard],
    canActivate: [AccountGuard]
  },
  {
    path: 'shared-list/:listId',
    loadChildren: () => import('./pages/shared-list/shared-list.module').then(m => m.SharedListModule),
    resolve: {
      sharedList: SharedListResolver
    }
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
