import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListResolver } from '../../resolvers/list/list.resolver';
import { EmailPreferencesResolver } from '../../resolvers/email-preferences/email-preferences.resolver';
import { AccountComponent } from './account.component';
import { ListIdResolver } from '../../resolvers/list-id/list-id.resolver';
import { OrdersResolver } from '../../resolvers/orders/orders.resolver';

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
    loadChildren: () => import('../../pages/email-preferences/email-preferences.module').then(m => m.EmailPreferencesModule),
    resolve: {
      preferences: EmailPreferencesResolver
    }
  },
  {
    path: 'lists',
    loadChildren: () => import('../../pages/lists/lists.module').then(m => m.ListsModule),
    resolve: {
      listData: ListResolver,
    }
  },
  {
    path: 'lists/:listId',
    loadChildren: () => import('../../pages/lists/lists.module').then(m => m.ListsModule),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      listData: ListIdResolver,
    }
  },
  {
    path: 'orders',
    loadChildren: () => import('../../pages/orders/orders.module').then(m => m.OrdersModule),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      ordersData: OrdersResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
