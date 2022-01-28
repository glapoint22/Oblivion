import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Image } from '../../classes/image';
import { Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'write-review-form',
  templateUrl: './write-review-form.component.html',
  styleUrls: ['./write-review-form.component.scss']
})
export class WriteReviewFormComponent extends Validation implements OnInit {
  public productId!: number;
  public productImage!: string;
  public productName!: string;
  public logInForm!: LogInFormComponent | null;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { super() }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      rating: new FormControl('', [
        Validators.required
      ]),
      title: new FormControl('', [
        Validators.required
      ]),
      review: new FormControl('', [
        Validators.required
      ])
    });
  }


  onSubmit(): void {
    if (this.form.valid) {
      this.spinnerService.show = true;
      let review: string = this.form.get('review')?.value;

      // Replace every new line with a <BR> tag
      review = review.replace(/[\r\n]/g, '<br>');

      this.dataService.post('api/ProductReviews', {
        productId: this.productId,
        rating: this.form.get('rating')?.value,
        title: this.form.get('title')?.value,
        text: review
      }, { authorization: true })
        .subscribe(() => {
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
        successPrompt.header = 'Write a Review';
        successPrompt.message = 'Thank you for your feedback.';
        successPrompt.writeReviewForm = this;
        this.spinnerService.show = false;
      });
  }


  onStarClick(star: number): void {
    this.form.get('rating')?.setValue(star);
  }


  getStar(i: number) {
    if (i <= Math.floor(this.form.get('rating')?.value)) {
      return 'full-star';
    } else {
      return 'empty-star';
    }
  }


  getRatingMessage(): string {
    const rating: number = this.form.get('rating')?.value;
    let message: string = 'How would you rate this?'

    switch (rating) {
      case 1:
        message = 'You are very dissatisfied.';
        break;
      case 2:
        message = 'Not what you were hoping for.';
        break;
      case 3:
        message = 'You think this item is fair.';
        break;
      case 4:
        message = 'It meets your expectations.';
        break;
      case 5:
        message = 'You are very satisfied.';
        break;
    }

    return message
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
  }
}