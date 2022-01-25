import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';
import { LogInFormComponent } from '../../components/log-in-form/log-in-form.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends LogInFormComponent implements OnInit {

  constructor
    (
      dataService: DataService,
      accountService: AccountService,
      lazyLoadingService: LazyLoadingService,
      spinnerService: SpinnerService,
      router: Router,
      private route: ActivatedRoute,
  ) {
    super
      (
        dataService,
        accountService,
        lazyLoadingService,
        spinnerService,
        router
      )
  }

  
  ngOnInit(): void {
    super.ngOnInit();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }
}