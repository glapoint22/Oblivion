import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { ResetPasswordFormComponent } from '../reset-password-form/reset-password-form.component';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {
  public isLoginPage!: boolean;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private router: Router
    ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');

    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.get('api/Account/ForgotPassword', [{
          key: 'email',
          value: this.form.get('email')?.value
        }], { spinnerAction: SpinnerAction.Start }).subscribe({
          complete: () => {
            this.fade();
            this.openResetPasswordOneTimePasswordForm(this.form.get('email')?.value);
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 409) {
              this.form.controls.email.setErrors({ noEmail: true });
            }
          }
        });
      }
    });
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  async onLogInLinkClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async openResetPasswordOneTimePasswordForm(email: string) {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ResetPasswordFormComponent } = await import('../reset-password-form/reset-password-form.component');
      const { ResetPasswordFormModule } = await import('../reset-password-form/reset-password-form.module');

      return {
        component: ResetPasswordFormComponent,
        module: ResetPasswordFormModule
      }
    }, SpinnerAction.End)
      .then((resetPasswordForm: ResetPasswordFormComponent) => {
        resetPasswordForm.email = email;
      });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) {
      this.onLogInLinkClick();
    }
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}