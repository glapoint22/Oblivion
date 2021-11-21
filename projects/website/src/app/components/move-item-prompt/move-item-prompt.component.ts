import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { DuplicateItemPromptComponent } from '../../components/duplicate-item-prompt/duplicate-item-prompt.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'move-item-prompt',
  templateUrl: './move-item-prompt.component.html',
  styleUrls: ['./move-item-prompt.component.scss']
})
export class MoveItemPromptComponent extends LazyLoad {
  public product!: Product;
  public fromList!: List;
  public toList!: KeyValue<any, any>;
  @Output() onMove: EventEmitter<void> = new EventEmitter();

  constructor(private dataService: DataService, private accountService: AccountService, private lazyLoadingService: LazyLoadingService) {
    super();
  }


  onMoveClick() {


    this.dataService.put<boolean>('api/lists/product', {

      ProductId: this.product.id,
      CollaboratorId: this.product.collaborator.id,
      FromListId: this.fromList.id,
      ToListId: this.toList.value


    }, this.accountService.getHeaders())
      .subscribe((isDuplicate: boolean) => {
        this.close();

        if (!isDuplicate) {
          this.onMove.emit();
        } else {
          this.openDuplicateItemPrompt();
        }

      });
  }


  async openDuplicateItemPrompt() {
    const { DuplicateItemPromptComponent } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.component');
    const { DuplicateItemPromptModule } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(DuplicateItemPromptComponent, DuplicateItemPromptModule, this.lazyLoadingService.container)
      .then((duplicateItemPrompt: DuplicateItemPromptComponent) => {
        duplicateItemPrompt.list = this.toList.key;
        duplicateItemPrompt.product = this.product.title;
      })
  }
}