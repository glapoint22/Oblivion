import { Injectable } from '@angular/core';
import { Customer } from '../../classes/customer';
import { CookieService } from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public customer: Customer | undefined;

  constructor(private cookieService: CookieService) {}

  public setCustomer() {
    let customerCookie = this.cookieService.getCookie('customer');

    if (customerCookie) {
      customerCookie = decodeURIComponent(customerCookie);
      const customerProperties = customerCookie.split(',');
      this.customer = new Customer(customerProperties[0], customerProperties[1], customerProperties[2], customerProperties[3]);
    }
  }
}