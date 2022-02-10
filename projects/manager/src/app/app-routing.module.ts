import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/pages/product-builder/product-builder.module').then(m => m.ProductBuilderModule),
    pathMatch: 'full'
  },
  {
    path: 'product-builder',
    redirectTo: ''
  },
  {
    path: 'page-builder',
    loadChildren: () => import('../app/pages/page-builder/page-builder.module').then(m => m.PageBuilderModule)
  },
  {
    path: 'email-builder',
    loadChildren: () => import('../app/pages/email-builder/email-builder.module').then(m => m.EmailBuilderModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
