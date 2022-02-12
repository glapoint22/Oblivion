import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad, LazyLoadingService } from 'common';
import { AccountListComponent } from '../account-list/account-list.component';

@Component({
  selector: 'account-menu-popup',
  templateUrl: './account-menu-popup.component.html',
  styleUrls: ['./account-menu-popup.component.scss']
})
export class AccountMenuPopupComponent extends LazyLoad implements OnInit {
  private index: number = -1;
  @ViewChild('accountList') accountList!: AccountListComponent;

  constructor(lazyLoadingService: LazyLoadingService, private router: Router) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    this.addEventListeners();
  }


  onTab(direction: number): void {
    // Niches
    this.index = this.index + (1 * direction);
    if (this.index > 5) this.index = 0;
    if (this.index < 0) this.index = 5;
    this.accountList.focusedListItemId = this.index.toString();
  }


  onArrowDown(e: KeyboardEvent): void {
    e.preventDefault();

    this.index = this.index + 1;
    if (this.index > 5) this.index = 5;
    this.accountList.focusedListItemId = this.index.toString();
  }


  onArrowUp(e: KeyboardEvent): void {
    e.preventDefault();

    this.index = this.index - 1;
    if (this.index < 0) this.index = 0;
    this.accountList.focusedListItemId = this.index.toString();
  }


  onEnter(e: KeyboardEvent): void {
    switch (this.index) {
      case 0:
        this.router.navigate(['account']);
        break;

      case 1:
        this.router.navigate(['account/orders']);
        break;

      case 2:
        this.router.navigate(['account/lists']);
        break;

      case 3:
        this.router.navigate(['account/profile']);
        break;

      case 4:
        this.router.navigate(['account/email-preferences']);
        break;

      case 5:
        this.accountList.onLogOutClick();
        break;
    }
  }
}