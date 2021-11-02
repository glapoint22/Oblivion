import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';

@Component({
  selector: 'create-list-form',
  templateUrl: './create-list-form.component.html',
  styleUrls: ['./create-list-form.component.scss']
})
export class CreateListFormComponent extends Validation implements OnInit {

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