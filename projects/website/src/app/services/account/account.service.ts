import { Injectable } from '@angular/core';
import { Customer } from '../../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public customer: Customer | undefined;


  getCustomerCookieIndex(strArray: Array<string>) {
    for (let i = 0; i < strArray.length; i++) {
      if (strArray[i].match('customer')) return i;
    }
    return -1;
  }

  public setCustomer() {
    const cookies: Array<string> = document.cookie.split(';');
    const indexOfCustomerCookie: number = this.getCustomerCookieIndex(cookies);

    if (indexOfCustomerCookie != -1) {
      const cookie: string = decodeURIComponent(cookies[indexOfCustomerCookie]);
      const indexOfEquels = cookie.indexOf('=') + 1;
      const customerSubStr = cookie.substr(indexOfEquels);
      const customerProperties = customerSubStr.split(',');
      this.customer = new Customer(customerProperties[0], customerProperties[1], customerProperties[2], customerProperties[3]);
    }
  }
}