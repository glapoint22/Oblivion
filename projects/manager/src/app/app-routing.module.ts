import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/product-builder/product-builder.module').then(m => m.ProductBuilderModule),
    pathMatch: 'full'
  },
  {
    path: 'product-builder',
    redirectTo: ''
  },
  {
    path: 'page-builder',
    loadChildren: () => import('./pages/page-builder/page-builder.module').then(m => m.PageBuilderModule)
  },
  {
    path: 'email-builder',
    loadChildren: () => import('./pages/email-builder/email-builder.module').then(m => m.EmailBuilderModule)
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
