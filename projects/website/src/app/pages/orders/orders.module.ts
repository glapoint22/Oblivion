import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { DropdownModule } from 'common';


@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    HeaderFooterModule,
    DropdownModule
  ]
})
export class OrdersModule { }
