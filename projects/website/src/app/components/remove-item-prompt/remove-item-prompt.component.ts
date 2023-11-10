import { Component, EventEmitter, Output } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'remove-item-prompt',
  templateUrl: './remove-item-prompt.component.html',
  styleUrls: ['./remove-item-prompt.component.scss']
})
export class RemoveItemPromptComponent extends LazyLoad {
  @Output() onRemove: EventEmitter<void> = new EventEmitter();
  public list!: List;
  public product!: ListProduct;
  private dataServiceDeleteSubscription!: Subscription;

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
    this.dataServiceDeleteSubscription = this.dataService.delete('api/Lists/RemoveProduct', {
      productId: this.product.id,
      listId: this.list.id
    }, { authorization: true }).subscribe(() => {
      this.onRemove.emit();
      this.close();
    });
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServiceDeleteSubscription) this.dataServiceDeleteSubscription.unsubscribe();
  }
}