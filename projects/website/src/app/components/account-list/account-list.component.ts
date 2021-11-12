import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  constructor(private dataService: DataService, private accountService: AccountService) { }


  onLogOutClick() {
    this.dataService.get('api/Account/LogOut').subscribe();
    this.accountService.customer = undefined;
  }

  close() {
    this.onClose.emit();
  }
}