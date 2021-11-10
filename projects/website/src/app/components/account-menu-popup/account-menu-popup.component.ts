import { Component } from '@angular/core';
import { Customer } from '../../classes/customer';
import { LazyLoad } from '../../classes/lazy-load';
import { CustomerService } from '../../services/customer/customer.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'account-menu-popup',
  templateUrl: './account-menu-popup.component.html',
  styleUrls: ['./account-menu-popup.component.scss']
})
export class AccountMenuPopupComponent extends LazyLoad {

  constructor(private dataService: DataService, private customerService: CustomerService) {super() }

  
  onLogOutClick() {
    this.dataService.get('api/Account/LogOut').subscribe();

    this.customerService.customer = {} as Customer;
  }
}