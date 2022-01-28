import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad } from '../../classes/lazy-load';
import { Product } from '../../classes/product';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';

@Component({
  selector: 'add-to-list-prompt',
  templateUrl: './add-to-list-prompt.component.html',
  styleUrls: ['./add-to-list-prompt.component.scss']
})
export class AddToListPromptComponent extends LazyLoad {
  public list!: KeyValue<string, string>;
  public product!: Product;
  public addToListForm!: AddToListFormComponent;

  constructor(private router: Router) { super() }


  onViewList() {
    this.router.navigate(['account', 'lists', this.list.value]);
    this.close();
  }


  close() {
    super.close();
    if (this.addToListForm) this.addToListForm.close();
  }
}