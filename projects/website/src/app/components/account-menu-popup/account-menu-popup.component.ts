import { Component, ViewContainerRef } from '@angular/core';
import { Customer } from '../../classes/customer';
import { CustomerService } from '../../services/customer/customer.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'account-menu-popup',
  templateUrl: './account-menu-popup.component.html',
  styleUrls: ['./account-menu-popup.component.scss']
})
export class AccountMenuPopupComponent {
  public accountMenuPopupContainer!: ViewContainerRef;

  constructor(private dataService: DataService, private customerService: CustomerService) { }

  
  onLogOutClick() {
    this.dataService.get('api/Account/LogOut').subscribe();

    this.accountMenuPopupContainer.clear();
    this.customerService.customer = {} as Customer;
  }

  onMenuOptionClick() {
    this.accountMenuPopupContainer.clear();
  }
}