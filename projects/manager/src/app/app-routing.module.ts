import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountGuard } from 'common';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/product-builder/product-builder.module').then(m => m.ProductBuilderModule),
    pathMatch: 'full',
    canActivate: [AccountGuard]
  },
  {
    path: 'product-builder',
    redirectTo: '',
    canActivate: [AccountGuard]
  },
  {
    path: 'page-builder',
    loadChildren: () => import('./pages/page-builder/page-builder.module').then(m => m.PageBuilderModule),
    canActivate: [AccountGuard]
  },
  {
    path: 'email-builder',
    loadChildren: () => import('./pages/email-builder/email-builder.module').then(m => m.EmailBuilderModule),
    canActivate: [AccountGuard]
  },
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then(m => m.LogInModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
