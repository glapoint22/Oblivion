import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'change-name-form',
  templateUrl: './change-name-form.component.html',
  styleUrls: ['./change-name-form.component.scss']
})
export class ChangeNameFormComponent extends Validation implements OnInit {

  constructor
    (
      dataService: DataService,
      public accountService: AccountService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(dataService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      firstName: new FormControl(this.accountService.customer?.firstName, {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      lastName: new FormControl(this.accountService.customer?.lastName, {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      })
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.put('api/Account/ChangeName', {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value
      },
        { authorization: true }
      ).subscribe(() => {
        this.accountService.setCustomer();
        this.fade();
        this.openSuccessPrompt();
      });
    }
  }


  async openSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Name Change';
        successPrompt.message = 'Your name has been successfully changed.';
        successPrompt.changeNameForm = this;
        this.spinnerService.show = false;
      });
  }
}