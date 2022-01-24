import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { invalidPasswordValidator, matchPasswordValidator, Validation } from '../../classes/validation';
import { SuccessPromptComponent } from '../../components/success-prompt/success-prompt.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends Validation implements OnInit {
  private token!: string;
  private email!: string;
  public isError!: boolean;

  constructor
    (
      private route: ActivatedRoute,
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super() }

  ngOnInit(): void {
    this.token = this.route.snapshot.data.resetPassword.token;
    this.email = this.route.snapshot.data.resetPassword.email;

    this.form = new FormGroup({
      'newPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ]),
      'confirmPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    }, { validators: matchPasswordValidator });
  }


  onSubmit() {
    this.isError = false;
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.post<boolean>('api/Account/ResetPassword', {
        token: this.token,
        email: this.email,
        password: this.form.get('newPassword')?.value
      }).subscribe((isError: boolean) => {
        if (isError) {
          this.isError = true;
        } else {
          this.router.navigate(['']);
          this.OpenSuccessPrompt();
        }
      });
    }
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../../components/success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../../components/success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Password Reset';
        successPromptComponent.message = 'Your password has been successfully reset.';
        this.spinnerService.show = false;
      });
  }
}
