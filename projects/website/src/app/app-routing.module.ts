import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountGuard } from './guards/account/account.guard';
import { SharedListResolver } from './resolvers/shared-list/shared-list.resolver';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowseResolver } from './resolvers/browse/browse.resolver';
import { CollaborateListResolver } from './resolvers/collaborate-list/collaborate-list.resolver';
import { HomeResolver } from './resolvers/home/home.resolver';
import { ProductResolver } from './resolvers/product/product.resolver';
import { SearchResolver } from './resolvers/search/search.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full',
    resolve: {
      page: HomeResolver
    }
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      searchData: SearchResolver
    }
  },
  {
    path: 'browse',
    loadChildren: () => import('./pages/browse/browse.module').then(m => m.BrowseModule),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      browseData: BrowseResolver
    }
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
    canActivate: [AccountGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about-page/about-page.module').then(m => m.AboutPageModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsModule),
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule),
  },
  {
    path: 'collaborate-list/:collaborateListId',
    loadChildren: () => import('./pages/collaborate-list/collaborate-list.module').then(m => m.CollaborateListModule),
    canActivate: [AccountGuard],
    resolve: {
      listInfo: CollaborateListResolver
    }
  },
  {
    path: 'shared-list/:listId',
    loadChildren: () => import('./pages/shared-list/shared-list.module').then(m => m.SharedListModule),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      sharedList: SharedListResolver
    }
  },
  {
    path: ':urlTitle/:id',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
    resolve: {
      product: ProductResolver
    }
  },
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then(m => m.LogInModule)
  },
  {
    path: 'cookies-policy',
    loadChildren: () => import('./pages/cookies-policy/cookies-policy.module').then(m => m.CookiesPolicyModule)
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
