import { KeyValue } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DataService, LazyLoadingService, RadioButtonLazyLoad, SpinnerAction, SummaryProduct } from 'common';
import { List } from '../../classes/list';
import { AddToListPromptComponent } from '../../components/add-to-list-prompt/add-to-list-prompt.component';
import { CreateListFormComponent } from '../create-list-form/create-list-form.component';
import { DuplicateItemPromptComponent } from '../duplicate-item-prompt/duplicate-item-prompt.component';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends RadioButtonLazyLoad implements OnInit {
  public lists!: Array<KeyValue<string, string>>;
  public product!: SummaryProduct;
  public productImage!: string;
  public selectedList!: KeyValue<string, string>;
  

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    this.dataService.get<Array<KeyValue<string, string>>>('api/Lists/GetDropdownLists', undefined, {
      authorization: true,
      spinnerAction: SpinnerAction.StartEnd
    })
      .subscribe((lists: Array<KeyValue<string, string>>) => {
        this.lists = lists;

        window.setTimeout(() => {
          super.ngAfterViewInit();

          // If there are lists available
          if (this.lists.length > 0) {
            this.selectedList = this.lists[0];
          }
        })
      });


      

      
  }



  


  onScroll(radioButtonsContainer: HTMLElement) {
    radioButtonsContainer.scrollTop = Math.round(radioButtonsContainer.scrollTop / 25) * 25;
  }


  onMouseWheel(e: WheelEvent, radioButtonsContainer: HTMLElement) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    radioButtonsContainer.scrollTop += (delta * 50);
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
        createListForm.productImage = this.productImage;
        createListForm.fromAddToListForm = true;
      });
  }



  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements[this.tabElements.length - 1].nativeElement != document.activeElement &&
        this.tabElements[this.tabElements.length - 2].nativeElement != document.activeElement &&
        this.tabElements[this.tabElements.length - 3].nativeElement != document.activeElement &&
        this.lists.length > 0) {
        this.onSubmit();
      }
    }
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.selectedList = this.lists[this.tabElements.indexOf(radioButton)];
  }
}