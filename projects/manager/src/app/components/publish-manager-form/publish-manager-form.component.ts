import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Observable } from 'rxjs';
import { BuilderType, ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { PublishItem } from '../../classes/publish-item';
import { ProductService } from '../../services/product/product.service';
import { PublishListComponent } from '../lists/publish-list/publish-list.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  templateUrl: './publish-manager-form.component.html',
  styleUrls: ['./publish-manager-form.component.scss']
})
export class PublishManagerFormComponent extends LazyLoad {
  private goTo!: string;
  private selectedPublishItem!: PublishItem;

  public spinner!: boolean;
  public listOptions: ListOptions = new ListOptions();
  public publishItems: Array<PublishItem> = new Array<PublishItem>();

  @ViewChild('listComponent') listComponent!: PublishListComponent;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService, private sanitizer: DomSanitizer) {
    super(lazyLoadingService);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.listOptions = {
      multiselectable: false,
      deletable: false,
      editable: false,
      menu: {
        parentObj: this,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            optionFunction: this.goToItem
          },
          {
            type: MenuOptionType.MenuItem,
            optionFunction: this.publishItem
          }
        ]
      }
    }

    this.dataService.get<Array<PublishItem>>('api/Publish', [], {
      authorization: true
    }).subscribe((publishItems: Array<PublishItem>) => {
      publishItems.forEach(x => {
        this.publishItems.push(x);
      })
    });
  }




  onPublishButton(publishItem: PublishItem) {
    this.selectedPublishItem = publishItem;
    this.publishItem();
  }



  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
      this.selectedPublishItem = listUpdate.selectedItems![0] as PublishItem;

      switch (this.selectedPublishItem.publishType) {
        case BuilderType.Product:
          this.goTo = this.listOptions.menu!.menuOptions[0].name = 'Go to Product';
          this.listOptions.menu!.menuOptions[1].name = 'Publish Product';
          break;

        case BuilderType.Page:
          this.goTo = this.listOptions.menu!.menuOptions[0].name = 'Go to Page';
          this.listOptions.menu!.menuOptions[1].name = 'Publish Page';
          break;

        case BuilderType.Email:
          this.goTo = this.listOptions.menu!.menuOptions[0].name = 'Go to Email';
          this.listOptions.menu!.menuOptions[1].name = 'Publish Email';
          break;
      }

      this.listOptions.menu!.menuOptions[1].isDisabled = this.selectedPublishItem.publishSuccessful;
    }
  }



  goToItem() {
    switch (this.selectedPublishItem.publishType) {
      case BuilderType.Product:
        this.productService.goToProduct(this.selectedPublishItem.productId);
        break;

      case BuilderType.Page:
        console.log('go to page')
        break;

      case BuilderType.Email:
        console.log('go to email')
        break;
    }
    this.close();
  }



  publishItem() {
    this.spinner = true;
    this.listComponent.listManager.promptOpen = true;
    let publish$: Observable<void>;

    // Product
    switch (this.selectedPublishItem.publishType) {
      case BuilderType.Product:
        publish$ = this.dataService.get('api/Publish/PublishProduct', [{ key: 'productId', value: this.selectedPublishItem.productId }], {
          authorization: true
        });
        break;

      // Page
      case BuilderType.Page:
        publish$ = this.dataService.get('api/Publish/PublishPage', [{ key: 'pageId', value: this.selectedPublishItem.pageId }], {
          authorization: true
        });
        break;

      // Email
      case BuilderType.Email:
        publish$ = this.dataService.get('api/Publish/PublishEmail', [{ key: 'emailId', value: this.selectedPublishItem.emailId }], {
          authorization: true
        });
        break;
    }


    publish$.subscribe({
      complete: () => {
        this.onPublishSuccess();
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        const errorKeys = Object.keys(httpErrorResponse.error);
        const errorList: Array<string> = new Array<string>();

        errorKeys.forEach((errorKey: string) => {
          const errorArray = httpErrorResponse.error[errorKey];
          errorArray.forEach((error: string) => errorList.push(error));
        });

        this.onPublishFail(errorList);
      }
    });
  }


  onPublishSuccess() {
    this.spinner = false;
    this.selectedPublishItem.publishSuccessful = true;
    this.listComponent.listManager.promptOpen = false;
    this.listComponent.listManager.selectedItem.selected = false;
    this.listComponent.listManager.selectedItem.selectType = null!;
    this.listComponent.listManager.selectedItem = null!;
    this.selectedPublishItem = null!;
  }



  onPublishFail(errorList: Array<string>) {
    this.spinner = false;

    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.listComponent.listManager.promptOpen = true;
      prompt.parentObj = this;
      prompt.title = 'Publish Failed';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        '<ul>' +
        this.compileErrorList(errorList) +
        '</ul>');
      prompt.primaryButton = {
        name: this.goTo,
        buttonFunction: this.goToItem
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.listComponent.listManager.promptOpen = false;
      })
    })
  }




  compileErrorList(errorList: Array<string>) {
    let bulletedErrorList = '';

    errorList.forEach(x => {
      bulletedErrorList += '<li>' + x + '</li>';
    })
    return bulletedErrorList;
  }



  onEscape(): void {
    if (this.listComponent.listManager.selectedItem == null) super.onEscape();
  }
}