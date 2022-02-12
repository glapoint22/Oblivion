import { Component } from '@angular/core';
import { LazyLoad, LazyLoadingService, SpinnerAction, SummaryProduct } from 'common';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';

@Component({
  selector: 'duplicate-item-prompt',
  templateUrl: './duplicate-item-prompt.component.html',
  styleUrls: ['./duplicate-item-prompt.component.scss']
})
export class DuplicateItemPromptComponent extends LazyLoad {
  public list!: string;
  public product!: SummaryProduct;
  public fromAddToListForm!: boolean

  constructor(lazyLoadingService: LazyLoadingService) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  async openAddToListForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
      const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

      return {
        component: AddToListFormComponent,
        module: AddToListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((addToListForm: AddToListFormComponent) => {
        addToListForm.product = this.product;
      });
  }


  close() {
    if (!this.fromAddToListForm) {
      super.close();
    } else {
      this.openAddToListForm();
    }
  }
}