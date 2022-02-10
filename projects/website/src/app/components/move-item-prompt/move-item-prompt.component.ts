import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { DuplicateItemPromptComponent } from '../../components/duplicate-item-prompt/duplicate-item-prompt.component';
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

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[1].nativeElement.focus();
  }


  onMoveClick() {
    this.dataService.put<boolean>('api/lists/product', {
      ProductId: this.product.id,
      CollaboratorId: this.product.collaborator.id,
      FromListId: this.fromList.id,
      ToListId: this.toList.value
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.Start,
      endSpinnerWhen: (isDuplicate: any) => !isDuplicate
    })
      .subscribe((isDuplicate: boolean) => {
        if (!isDuplicate) {
          this.close();
          this.onMove.emit();
        } else {
          this.openDuplicateItemPrompt();
        }
      });
  }


  async openDuplicateItemPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { DuplicateItemPromptComponent } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.component');
      const { DuplicateItemPromptModule } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.module');

      return {
        component: DuplicateItemPromptComponent,
        module: DuplicateItemPromptModule
      }
    }, SpinnerAction.End)
      .then((duplicateItemPrompt: DuplicateItemPromptComponent) => {
        duplicateItemPrompt.list = this.toList.key;
        duplicateItemPrompt.product = this.product;
      });
  }
}