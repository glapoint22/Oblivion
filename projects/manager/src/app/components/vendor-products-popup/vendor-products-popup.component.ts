import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { Subject } from 'rxjs';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ImageItem } from '../../classes/image-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { ProductService } from '../../services/product/product.service';
import { ImageListComponent } from '../lists/image-list/image-list.component';

@Component({
  templateUrl: './vendor-products-popup.component.html',
  styleUrls: ['./vendor-products-popup.component.scss']
})
export class VendorProductsPopupComponent extends LazyLoad {
  private idOfSelectedVendorProduct!: number;

  public vendorId!: number;
  public onClose: Subject<void> = new Subject<void>();
  public products: Array<ImageItem> = new Array<ImageItem>();
  public listOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Go to Product',
          optionFunction: this.goToProduct
        }
      ]
    }
  }

  @Output() onGoToProductClick: EventEmitter<void> = new EventEmitter();
  @ViewChild('imageListComponent') imageListComponent!: ImageListComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    if (!this.imageListComponent.listManager.selectedItem && !this.imageListComponent.listManager.contextMenuOpen) this.close();
  }


  onOpen() {
    this.dataService.get<Array<ImageItem>>('api/Vendors/Products', [{ key: "id", value: this.vendorId }], {
      authorization: true
    }).subscribe((products: Array<ImageItem>) => {
      products.forEach(x => {
        this.products.push(x);
      })
    })
  }


  goToProduct() {
    this.productService.goToProduct(this.idOfSelectedVendorProduct);
    this.onGoToProductClick.emit();
  }

  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
      this.idOfSelectedVendorProduct = listUpdate.selectedItems![0].id!;
    }
  }


  onEscape(): void {
    if (!this.imageListComponent.listManager.selectedItem && !this.imageListComponent.listManager.contextMenuOpen) super.onEscape();
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}