import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  public getCookie(cookieName: string): string {
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
}
