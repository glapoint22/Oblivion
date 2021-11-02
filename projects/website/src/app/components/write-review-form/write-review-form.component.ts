import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';

@Component({
  selector: 'write-review-form',
  templateUrl: './write-review-form.component.html',
  styleUrls: ['./write-review-form.component.scss']
})
export class WriteReviewFormComponent extends Validation implements OnInit {

  ngOnInit(): void {
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
      console.log('Submit');
    }
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