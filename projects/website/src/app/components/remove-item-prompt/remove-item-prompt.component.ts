import { Component, EventEmitter, Output } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';

@Component({
  selector: 'remove-item-prompt',
  templateUrl: './remove-item-prompt.component.html',
  styleUrls: ['./remove-item-prompt.component.scss']
})
export class RemoveItemPromptComponent extends LazyLoad {
  @Output() onRemove: EventEmitter<void> = new EventEmitter();
  public list!: List;
  public product!: ListProduct;

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