import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'remove-item-prompt',
  templateUrl: './remove-item-prompt.component.html',
  styleUrls: ['./remove-item-prompt.component.scss']
})
export class RemoveItemPromptComponent extends LazyLoad {
  @Output() onRemove: EventEmitter<void> = new EventEmitter();
  public list!: List;
  public product!: Product;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onRemoveClick() {
    this.dataService.delete('api/Lists/Product', {
      productId: this.product.id,
      collaboratorId: this.product.collaborator.id,
      listId: this.list.id
    }, { authorization: true }).subscribe(() => {
      this.onRemove.emit();
      this.close();
    });
  }
}