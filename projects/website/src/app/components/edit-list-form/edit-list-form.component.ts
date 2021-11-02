import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';

@Component({
  selector: 'edit-list-form',
  templateUrl: './edit-list-form.component.html',
  styleUrls: ['./edit-list-form.component.scss']
})
export class EditListFormComponent extends Validation implements OnInit {

  ngOnInit(): void {
    this.form = new FormGroup({
      listName: new FormControl('', [
        Validators.required])
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }
}