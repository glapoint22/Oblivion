import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
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
    if (this.accountService.user) {
      // Set focus to the message field
      this.setFocus(2);

      // Populate the name field with the user's name
      this.name.nativeElement.disabled = true;
      this.name.nativeElement.value = this.accountService.user.firstName + ' ' + this.accountService.user.lastName;

      // Populate the email field with the user's email
      this.email.nativeElement.disabled = true;
      this.email.nativeElement.value = this.accountService.user.email;

      // If the user is NOT logged in
    } else {

      // Set focus to the name field
      this.setFocus(0);
    }
  }


  onSubmit() {
    // If the user is (NOT) logged in and as long as the form is valid
    if ((!this.accountService.user && this.form.valid) ||
      // Or if the user (IS) logged in and as long as the message field is valid
      (this.accountService.user && !this.form.controls.message.errors)) {

      // Post the message
      if (this.accountService.user) {
        this.postMessage();
      } else {
        this.postNonAccountMessage();
      }
    }
  }


  postNonAccountMessage() {
    this.dataService.post('api/Notifications/PostNonAccountMessage', {
      name: this.form.get('name')?.value.trim(),
      email: this.form.get('email')?.value.trim(),
      text: this.form.get('message')?.value.trim()
    }, {
      spinnerAction: SpinnerAction.Start
    }).subscribe(() => {
      this.openSuccessPrompt();
    });
  }


  postMessage() {
    this.dataService.post('api/Notifications/PostMessage', {
      text: this.form.get('message')?.value.trim()
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    }).subscribe(() => {
      this.openSuccessPrompt();
    });
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