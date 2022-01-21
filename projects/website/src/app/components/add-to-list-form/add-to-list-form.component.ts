import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateListFormComponent } from '../create-list-form/create-list-form.component';
import { DuplicateItemPromptComponent } from '../duplicate-item-prompt/duplicate-item-prompt.component';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends LazyLoad {
  public lists!: Array<KeyValue<string, string>>;
  public product!: Product;
  public selectedList!: KeyValue<string, string>;

  constructor
    (
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(); }


  ngOnInit() {
    this.dataService.get<Array<KeyValue<string, string>>>('api/Lists/DropdownLists', undefined, {
      authorization: true,
      showSpinner: true
    })
      .subscribe((lists: Array<KeyValue<string, string>>) => {
        this.lists = lists;

        if (this.lists.length > 0) {
          this.selectedList = this.lists[0];
        }
      });
  }

  onSubmit() {
    this.dataService.post<boolean>('api/Lists/AddProduct', {
      productId: this.product.id,
      listId: this.selectedList.value
    }, { authorization: true }).subscribe((isDuplicate: boolean) => {
      if (isDuplicate) {
        this.openDuplicateItemPrompt();
      } else {
        this.close();
      }
    });
  }


  async openDuplicateItemPrompt() {
    this.spinnerService.show = true;
    const { DuplicateItemPromptComponent } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.component');
    const { DuplicateItemPromptModule } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(DuplicateItemPromptComponent, DuplicateItemPromptModule, this.lazyLoadingService.container)
      .then((duplicateItemPrompt: DuplicateItemPromptComponent) => {
        duplicateItemPrompt.list = this.selectedList.key;
        duplicateItemPrompt.product = this.product.name;
        this.spinnerService.show = false;
      });
    
  }



  async createList() {
    this.spinnerService.show = true;
    const { CreateListFormComponent } = await import('../../components/create-list-form/create-list-form.component');
    const { CreateListFormModule } = await import('../../components/create-list-form/create-list-form.module');

    this.lazyLoadingService.getComponentAsync(CreateListFormComponent, CreateListFormModule, this.lazyLoadingService.container)
      .then((createListForm: CreateListFormComponent) => {
        createListForm.onListCreated.subscribe((list: List) => {
          this.lists.push({
            key: list.name,
            value: list.id
          });
          this.selectedList = this.lists[this.lists.length - 1];
        });

        this.spinnerService.show = false;
      });

    
  }
}
