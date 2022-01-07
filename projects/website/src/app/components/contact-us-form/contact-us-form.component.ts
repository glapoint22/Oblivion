import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidNameValidator, Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss']
})
export class ContactUsFormComponent extends Validation implements OnInit {

  constructor(private dataService: DataService) { super() }

  ngOnInit(): void {
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
      this.dataService.post('api/Notifications/Message', {
        name: this.form.get('name')?.value,
        email: this.form.get('email')?.value,
        message: this.form.get('message')?.value
      }).subscribe(() => this.close());
    }
  }
}