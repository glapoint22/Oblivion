import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'remove-item-prompt',
  templateUrl: './remove-item-prompt.component.html',
  styleUrls: ['./remove-item-prompt.component.scss']
})
export class RemoveItemPromptComponent extends LazyLoad {
  @Output() onRemove: EventEmitter<void> = new EventEmitter();
  public list!: List;
  public product!: Product;

  constructor(private dataService: DataService, private accountService: AccountService) {
    super();
  }

  onRemoveClick() {
    this.dataService.delete('api/Lists/Product', {
      productId: this.product.id,
      collaboratorId: this.product.collaborator.id,
      listId: this.list.id
    }, this.accountService.getHeaders()).subscribe(()=> {
      this.onRemove.emit();
      this.close();
    });
  }
}