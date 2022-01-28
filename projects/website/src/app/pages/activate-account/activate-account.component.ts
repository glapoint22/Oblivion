import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'activate-account',
  template: ''
})
export class ActivateAccountComponent implements OnInit {

  constructor
    (
      private route: ActivatedRoute,
      private dataService: DataService,
      private router: Router,
      private accountService: AccountService
    ) { }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    this.dataService.post("api/Account/ActivateAccount", {
      email: email,
      token: token
    }, {
      showSpinner: true
    }).subscribe(() => {
      this.accountService.setCustomer();
      this.accountService.refreshTokenSet = true;
      this.accountService.startRefreshTokenTimer();
      this.router.navigate(['']);
    });
  }
}