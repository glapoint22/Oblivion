import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { Product } from '../../classes/product';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';

@Component({
  selector: 'add-to-list-prompt',
  templateUrl: './add-to-list-prompt.component.html',
  styleUrls: ['./add-to-list-prompt.component.scss']
})
export class AddToListPromptComponent extends LazyLoad {
  public list!: string;
  public product!: Product;
  public addToListForm!: AddToListFormComponent;


  onViewList() {
    
  }


  close() {
    super.close();
    if (this.addToListForm) this.addToListForm.close();
  }
}