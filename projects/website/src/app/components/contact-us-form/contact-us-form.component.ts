import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidNameValidator, Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss']
})
export class ContactUsFormComponent extends Validation implements OnInit {

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { super() }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      message: new FormControl('', [
        Validators.required
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.post('api/Notifications/Message', {
        name: this.form.get('name')?.value,
        email: this.form.get('email')?.value,
        message: this.form.get('message')?.value
      }).subscribe(() => {
        this.fade()
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
        successPrompt.header = 'Contact Us';
        successPrompt.message = 'Thank you for contacting Niche Shack.';
        successPrompt.contactUsForm = this;
        this.spinnerService.show = false;
      });
  }
}