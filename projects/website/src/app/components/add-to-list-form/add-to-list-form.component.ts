import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { AddToListPromptComponent } from '../../components/add-to-list-prompt/add-to-list-prompt.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateListFormComponent } from '../create-list-form/create-list-form.component';
import { DuplicateItemPromptComponent } from '../duplicate-item-prompt/duplicate-item-prompt.component';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends LazyLoad implements OnInit {
  public lists!: Array<KeyValue<string, string>>;
  public product!: Product;
  public selectedList!: KeyValue<string, string>;
  public duplicateItemPrompt!: DuplicateItemPromptComponent;
  public createListForm!: CreateListFormComponent;
  public logInForm!: LogInFormComponent | null;

  constructor
    (
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(); }


  ngOnInit() {
    super.ngOnInit();
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
      this.fade();
      if (isDuplicate) {
        this.openDuplicateItemPrompt();
      } else {
        this.openAddToListPrompt();
      }
    });
  }


  async openDuplicateItemPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    const { DuplicateItemPromptComponent } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.component');
    const { DuplicateItemPromptModule } = await import('../../components/duplicate-item-prompt/duplicate-item-prompt.module');

    this.lazyLoadingService.getComponentAsync(DuplicateItemPromptComponent, DuplicateItemPromptModule, this.lazyLoadingService.container)
      .then((duplicateItemPrompt: DuplicateItemPromptComponent) => {
        duplicateItemPrompt.list = this.selectedList.key;
        duplicateItemPrompt.product = this.product;
        duplicateItemPrompt.addToListForm = this;
        this.spinnerService.show = false;
      });
  }


  async openAddToListPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    const { AddToListPromptComponent } = await import('../../components/add-to-list-prompt/add-to-list-prompt.component');
    const { AddToListPromptModule } = await import('../../components/add-to-list-prompt/add-to-list-prompt.module');

    this.lazyLoadingService.getComponentAsync(AddToListPromptComponent, AddToListPromptModule, this.lazyLoadingService.container)
      .then((addToListPrompt: AddToListPromptComponent) => {
        addToListPrompt.list = this.selectedList.key;
        addToListPrompt.product = this.product;
        addToListPrompt.addToListForm = this;
        this.spinnerService.show = false;
      });
  }



  async createList() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
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
        createListForm.product = this.product;
        createListForm.addToListForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.duplicateItemPrompt) {
      this.duplicateItemPrompt.close();
      this.duplicateItemPrompt.addToListForm.close();
    }
    if (this.createListForm) {
      this.createListForm.close();
      this.createListForm.addToListForm.close();
    }
    if (this.logInForm) this.logInForm.close();
  }
}