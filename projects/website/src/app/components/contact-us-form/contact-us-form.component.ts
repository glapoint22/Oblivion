import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, NotificationType, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss']
})
export class ContactUsFormComponent extends Validation implements OnInit {
  @ViewChild('name') name!: ElementRef<HTMLInputElement>;
  @ViewChild('email') email!: ElementRef<HTMLInputElement>;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      public accountService: AccountService
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      }),
      message: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      })
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // If the user is logged in
    if (this.accountService.customer) {
      // Set focus to the message field
      this.setFocus(2);

      // Populate the name field with the user's name
      this.name.nativeElement.disabled = true;
      this.name.nativeElement.value = this.accountService.customer.firstName + ' ' + this.accountService.customer.lastName;

      // Populate the email field with the user's email
      this.email.nativeElement.disabled = true;
      this.email.nativeElement.value = this.accountService.customer.email;

      // If the user is NOT logged in
    } else {

      // Set focus to the name field
      this.setFocus(0);
    }
  }

  
  onSubmit() {
    // If the user is (NOT) logged in and as long as the form is valid
    if ((!this.accountService.customer && this.form.valid) ||
      // Or if the user (IS) logged in and as long as the message field is valid
      (this.accountService.customer && !this.form.controls.message.errors)) {

      // Post the message
      this.dataService.post('api/Notifications/Message', {
        type: NotificationType.Message,
        nonAccountName: !this.accountService.customer ? this.form.get('name')?.value.trim() : null,
        nonAccountEmail: !this.accountService.customer ? this.form.get('email')?.value.trim() : null,
        email: this.accountService.customer ? this.email.nativeElement.value : null,
        text: this.form.get('message')?.value.trim()
      }, {
        authorization: this.accountService.customer ? true : false,
        spinnerAction: SpinnerAction.Start
      }).subscribe(() => {
        this.openSuccessPrompt();
      });
    }
  }


  async openSuccessPrompt() {
    this.fade()

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Contact Us';
        successPrompt.message = 'Thank you for contacting Niche Shack.';
      });
  }
}