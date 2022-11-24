import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from 'common';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  public focusedListItemId!: string;
  constructor(private accountService: AccountService) { }


  onLogOutClick() {
    this.accountService.logOut();
  }

  close() {
    this.onClose.emit();
  }
}