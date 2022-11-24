import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { List } from '../../classes/list';
import { ListProduct } from '../../classes/list-product';
import { DuplicateItemPromptComponent } from '../../components/duplicate-item-prompt/duplicate-item-prompt.component';

@Component({
  selector: 'move-item-prompt',
  templateUrl: './move-item-prompt.component.html',
  styleUrls: ['./move-item-prompt.component.scss']
})
export class MoveItemPromptComponent extends LazyLoad {
  public product!: ListProduct;
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
    this.setFocus(1);
  }


  onMoveClick() {
    this.dataService.put<boolean>('api/lists/MoveProduct', {
      productId: this.product.id,
      sourceListId: this.fromList.id,
      destinationListId: this.toList.value
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.StartEnd
    })
      .subscribe({
        complete: () => {
          this.close();
          this.onMove.emit();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 409) this.openDuplicateItemPrompt();
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


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}