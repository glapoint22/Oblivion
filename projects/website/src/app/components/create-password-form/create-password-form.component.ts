import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'create-password-form',
  templateUrl: './create-password-form.component.html',
  styleUrls: ['./create-password-form.component.scss']
})
export class CreatePasswordFormComponent extends Validation implements OnInit {
  public externalLoginProvider!: string;
  public email!: string;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private accountService: AccountService
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      newPassword: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      confirmPassword: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    }, { validators: this.matchPasswordValidator });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.get('api/Account/AddPassword', [
        {
          key: 'password',
          value: this.form.get('newPassword')?.value
        }
      ],
        {
          authorization: true
        }).subscribe(() => {
          this.accountService.setCustomer();
          this.OpenSuccessPrompt();
        });
    }
  }


  async OpenSuccessPrompt() {
    this.fade();
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Password Creation';
        successPrompt.message = 'Your password has been successfully created.';
        this.spinnerService.show = false;
      });
  }
}