import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
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

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService
    ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      rating: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),
      title: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),
      review: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      })
    });
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.base.nativeElement.focus();
  }


  onSubmit(): void {
    if (this.form.valid) {
      let review: string = this.form.get('review')?.value;

      // Replace every new line with a <BR> tag
      review = review.replace(/[\r\n]/g, '<br>');

      this.dataService.post('api/ProductReviews', {
        productId: this.productId,
        rating: this.form.get('rating')?.value,
        title: this.form.get('title')?.value,
        text: review
      }, {
        authorization: true,
        spinnerAction: SpinnerAction.Start
      })
        .subscribe(() => {
          this.openSuccessPrompt();
        });
    }
  }


  async openSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Write a Review';
        successPrompt.message = 'Thank you for your feedback.';
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
}