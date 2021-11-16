import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidNameValidator, Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'change-name-form',
  templateUrl: './change-name-form.component.html',
  styleUrls: ['./change-name-form.component.scss']
})
export class ChangeNameFormComponent extends Validation implements OnInit {

  constructor(private accountService: AccountService, private dataService: DataService, private lazyLoadingService: LazyLoadingService) { super() }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl(this.accountService.customer?.firstName, [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      lastName: new FormControl(this.accountService.customer?.lastName, [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataService.put('api/Account/ChangeName', {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value
      },
      this.accountService.getHeaders()
      ).subscribe(() => {
        this.accountService.setCustomer();
        this.close();
        this.OpenSuccessPrompt();
      });
    }
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
    .then((successPromptComponent: SuccessPromptComponent)=> {
      successPromptComponent.header = 'Successful Name Change';
      successPromptComponent.message = 'Your name has been successfully changed.';
    });
  }
}