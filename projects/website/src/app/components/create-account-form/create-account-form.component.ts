import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { invalidNameValidator, invalidPasswordValidator, Validation } from '../../classes/validation';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent extends Validation implements OnInit {

  constructor(private lazyLoadingService: LazyLoadingService) { super() }


  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container);
  }
}