import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public customer: Customer | undefined;


  private getCookie(cookieName: string): string {
    let content!: string;

    // Make sure there are cookies
    if (document.cookie && document.cookie.length > 0) {
      // Split the cookies into an array
      const cookieArray = document.cookie.split(';');

      // Find the cookie
      const cookie = cookieArray.find(x => x.trim().substr(0, cookieName.length) == cookieName);

      // get the content from the cookie
      if (cookie) content = cookie.substr(cookie.indexOf('=') + 1);
    }

    return content;
  }


  public setCustomer() {
    let customerCookie = this.getCookie('customer');

    if (customerCookie) {
      customerCookie = decodeURIComponent(customerCookie);
      const customerProperties = customerCookie.split(',');
      this.customer = new Customer(customerProperties[0], customerProperties[1], customerProperties[2], customerProperties[3]);
    }
  }


  public getHeaders() {
    const accessToken = this.getCookie('access');

    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken
    });

  }



  public getProfileImg() {
    if (this.customer && this.customer.profileImage) return 'images/' + this.customer.profileImage;
    return 'assets/no-account-pic.png';
  }
}