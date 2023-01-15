import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { DisabledProductItem } from '../../classes/disabled-product-item';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { ImageListComponent } from '../lists/image-list/image-list.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  templateUrl: './disabled-products-form.component.html',
  styleUrls: ['./disabled-products-form.component.scss']
})
export class DisabledProductsFormComponent extends LazyLoad {
  private selectedDisabledProduct!: DisabledProductItem;

  public listOptions: ListOptions = new ListOptions();
  public disabledProducts: Array<DisabledProductItem> = new Array<DisabledProductItem>();
  @ViewChild('listComponent') listComponent!: ImageListComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer) {
    super(lazyLoadingService);
  }

  ngOnInit() {
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
            name: 'Go to Product Website',
            optionFunction: this.goToProductWebsite
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Enable Product',
            optionFunction: this.openPrompt
          }
        ]
      }
    }

    this.dataService.get<Array<DisabledProductItem>>('api/Products/DisabledProducts', undefined, {
      authorization: true
    }).subscribe((disabledProducts: Array<DisabledProductItem>) => {
      disabledProducts.forEach(x => this.disabledProducts.push(x));
    })
  }



  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
      this.selectedDisabledProduct = listUpdate.selectedItems![0] as DisabledProductItem;
    }
  }



  goToProductWebsite() {
    window.open(this.selectedDisabledProduct.hoplink, '_blank');
  }



  openPrompt() {
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
      prompt.title = 'Enable Product';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The product' +
        ' <span style="color: #ffba00">\"' + this.selectedDisabledProduct.name + '\"</span>' +
        ' will no longer be disabled.');;
      prompt.primaryButton = {
        name: 'Enable',
        buttonFunction: this.enableProduct
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.listComponent.listManager.promptOpen = false;
      })
    })
  }


  enableProduct() {
    this.dataService.put('api/Products/DisableEnableProduct',
      {
        productId: this.selectedDisabledProduct.id
      },
      {
        authorization: true
      }).subscribe();

    this.listComponent.listManager.delete();
  }


  onEscape(): void {
    if (this.listComponent.listManager.selectedItem == null) super.onEscape();
  }
}