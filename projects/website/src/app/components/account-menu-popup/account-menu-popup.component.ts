import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'account-menu-popup',
  templateUrl: './account-menu-popup.component.html',
  styleUrls: ['./account-menu-popup.component.scss']
})
export class AccountMenuPopupComponent extends LazyLoad implements OnInit {

  ngOnInit(): void {
    this.addEventListeners();
  }
}