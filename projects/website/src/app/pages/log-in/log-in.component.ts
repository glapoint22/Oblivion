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
      lazyLoadingService: LazyLoadingService,
      dataService: DataService,
      accountService: AccountService,
      spinnerService: SpinnerService,
      router: Router,
      private route: ActivatedRoute,
  ) {
    super
      (
        lazyLoadingService,
        dataService,
        accountService,
        spinnerService,
        router
      )
  }


  ngOnInit(): void {
    this.setForm();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }
}