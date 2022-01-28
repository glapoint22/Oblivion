import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';
import { Product } from '../../classes/product';
import { MoveItemPromptComponent } from '../move-item-prompt/move-item-prompt.component';

@Component({
  selector: 'duplicate-item-prompt',
  templateUrl: './duplicate-item-prompt.component.html',
  styleUrls: ['./duplicate-item-prompt.component.scss']
})
export class DuplicateItemPromptComponent extends LazyLoad {
  public list!: string;
  public product!: Product;
  public addToListForm!: AddToListFormComponent;
  public moveItemPrompt!: MoveItemPromptComponent;


  close() {
    super.close();
    if (this.moveItemPrompt) this.moveItemPrompt.close();
    if (this.addToListForm) {
      this.addToListForm.addEventListener();
      this.addToListForm.fadeOut = false;
    }
  }
}