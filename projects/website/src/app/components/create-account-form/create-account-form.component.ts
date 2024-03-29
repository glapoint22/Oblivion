import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { ActivateAccountFormComponent } from '../../components/activate-account-form/activate-account-form.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent extends Validation implements OnInit {
  public isLoginPage!: boolean;
  private dataServicePostSubscription!: Subscription;
  private formStatusChangesSubscription!: Subscription;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private router: Router,
    ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');

    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      lastName: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      password: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      email: new UntypedFormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      })
    });
    
    this.formStatusChangesSubscription = this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataServicePostSubscription = this.dataService.post('api/Account/SignUp', {
          firstName: this.form.get('firstName')?.value,
          lastName: this.form.get('lastName')?.value,
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value
        }, {
          spinnerAction: SpinnerAction.Start
        })
          .subscribe({
            complete: () => {
              this.fade();
              this.openAccountActivationForm();
            },
            error: (error: HttpErrorResponse) => {
              if (error.status < 500) {
                this.form.controls.email.setErrors({ duplicateEmail: true });
              }
            }
          });
      }
    });
  }

  ngAfterViewInit(): void {
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





  async openAccountActivationForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ActivateAccountFormComponent } = await import('../../components/activate-account-form/activate-account-form.component');
      const { ActivateAccountFormModule } = await import('../../components/activate-account-form/activate-account-form.module');

      return {
        component: ActivateAccountFormComponent,
        module: ActivateAccountFormModule
      }
    }, SpinnerAction.End)
      .then((ActivateAccountForm: ActivateAccountFormComponent) => {
        ActivateAccountForm.email = this.form.get('email')?.value;
      });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[5].nativeElement == document.activeElement) {
      this.onLogInLinkClick();
    }
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServicePostSubscription) this.dataServicePostSubscription.unsubscribe();
    if (this.formStatusChangesSubscription) this.formStatusChangesSubscription.unsubscribe();
  }
}