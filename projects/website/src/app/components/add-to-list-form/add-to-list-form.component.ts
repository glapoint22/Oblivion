import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction, SummaryProduct } from 'common';
import { List } from '../../classes/list';
import { AddToListPromptComponent } from '../../components/add-to-list-prompt/add-to-list-prompt.component';
import { CreateListFormComponent } from '../create-list-form/create-list-form.component';
import { DuplicateItemPromptComponent } from '../duplicate-item-prompt/duplicate-item-prompt.component';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends LazyLoad implements OnInit {
  public lists!: Array<KeyValue<string, string>>;
  public product!: SummaryProduct;
  public selectedList!: KeyValue<string, string>;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
  ) { super(lazyLoadingService) }


  ngOnInit() {
    super.ngOnInit();
    this.dataService.get<Array<KeyValue<string, string>>>('api/Lists/DropdownLists', undefined, {
      authorization: true,
      spinnerAction: SpinnerAction.StartEnd
    })
      .subscribe((lists: Array<KeyValue<string, string>>) => {
        this.lists = lists;

        // If there are lists available
        if (this.lists.length > 0) {
          this.selectedList = this.lists[0];

          if (this.lists.length == 1) this.base.nativeElement.focus();

          if (this.lists.length > 1) {
            // Wait while the lists are being created in the view
            window.setTimeout(() => {
              // The tabElements array was already populated in ngAfterViewInit but the lists probably weren't available
              // at that time, so we're updating tabElements again so that the lists can be in the array
              this.tabElements = this.HTMLElements.toArray();
              // Set focus to the first list
              this.setFocus(0);
            }, 100);
          }
          // If there are NO lists
        } else {
          this.base.nativeElement.focus();
        }
      });
  }




  onSubmit() {
    this.dataService.post<boolean>('api/Lists/AddProduct', {
      productId: this.product.id,
      listId: this.selectedList.value
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    }).subscribe((isDuplicate: boolean) => {
      if (isDuplicate) {
        this.openDuplicateItemPrompt();
      } else {
        this.openAddToListPrompt();
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
        if (this.selectedList) duplicateItemPrompt.list = this.selectedList.key;
        duplicateItemPrompt.product = this.product;
        duplicateItemPrompt.fromAddToListForm = true;
      });
  }


  async openAddToListPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { AddToListPromptComponent } = await import('../../components/add-to-list-prompt/add-to-list-prompt.component');
      const { AddToListPromptModule } = await import('../../components/add-to-list-prompt/add-to-list-prompt.module');

      return {
        component: AddToListPromptComponent,
        module: AddToListPromptModule
      }
    }, SpinnerAction.End)
      .then((addToListPrompt: AddToListPromptComponent) => {
        addToListPrompt.list = this.selectedList;
        addToListPrompt.product = this.product;
      });
  }



  async createList() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { CreateListFormComponent } = await import('../../components/create-list-form/create-list-form.component');
      const { CreateListFormModule } = await import('../../components/create-list-form/create-list-form.module');

      return {
        component: CreateListFormComponent,
        module: CreateListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((createListForm: CreateListFormComponent) => {
        createListForm.onListCreated.subscribe((list: List) => {
          this.lists.push({
            key: list.name,
            value: list.id
          });
          this.selectedList = this.lists[this.lists.length - 1];
        });
        createListForm.product = this.product;
        createListForm.fromAddToListForm = true;
      });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();

    if (this.tabElements) {
      for (let i = 0; i < this.tabElements.length; i++) {
        if (this.tabElements[i].nativeElement == document.activeElement) {
          if (this.tabElements[i].nativeElement.previousElementSibling instanceof HTMLInputElement) {
            this.selectedList = this.lists[i];
          }
        }
      }
    }
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      for (let i = 0; i < this.tabElements.length; i++) {
        if (this.tabElements[i].nativeElement == document.activeElement) {
          if (this.tabElements[i].nativeElement.previousElementSibling instanceof HTMLInputElement) {
            if (this.selectedList != this.lists[i]) {
              this.selectedList = this.lists[i];
            } else {
              this.onSubmit();
            }
          }
          return;
        }
      }

      if (this.tabElements[this.tabElements.length - 1].nativeElement != document.activeElement &&
        this.tabElements[this.tabElements.length - 2].nativeElement != document.activeElement &&
        this.tabElements[this.tabElements.length - 3].nativeElement != document.activeElement &&
        this.lists.length > 0) {
        this.onSubmit();
      }
    }
  }
}