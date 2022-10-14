import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'product-builder',
  templateUrl: './product-builder.component.html',
  styleUrls: ['./product-builder.component.scss']
})
export class ProductBuilderComponent {
  constructor(public productService: ProductService, private lazyLoadingService: LazyLoadingService) { }
  @ViewChild('productsContainer', { read: ViewContainerRef }) productsContainer!: ViewContainerRef;


  ngAfterViewInit() {
    this.productService.productsContainer = this.productsContainer;
  }


  getTabLabelWidth(tabsContainer: HTMLElement) {
    const leftPadding = 10;
    const x = 16;
    const rightPadding = 3;
    const labelWidth = Math.floor((tabsContainer.offsetWidth / this.productService.productComponents.length) - leftPadding - x - rightPadding);
    return labelWidth > 0 ? labelWidth : 0;
  }


  onTabMouseDown(e: MouseEvent, tabIndex: number, product: ProductPropertiesComponent) {


    if (e.button == 2) {

      this.lazyLoadingService.load(async () => {
        const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
        const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

        return {
          component: ContextMenuComponent,
          module: ContextMenuModule
        }
      }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
        contextMenu.xPos = e.clientX + 5;
        contextMenu.yPos = e.clientY + 5;
        contextMenu.options = [
          {
            type: MenuOptionType.MenuItem,
            name: 'Close',
            optionFunction: () => {
              this.closeProduct(tabIndex, product);
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Close Others',
            optionFunction: () => {
              this.closeOthers(product);
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Close All',
            optionFunction: () => {
              this.closeAll();
            }
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Close to the Right',
            optionFunction: () => {
              this.closeToTheRight(tabIndex);
            }
          }
        ]
      });


    } else {

      if (product != this.productService.selectedProduct) this.productService.goToProduct(product.product.id);
    }
  }




  closeProduct(tabIndex: number, product: ProductPropertiesComponent) {

    if (product == this.productService.selectedProduct) {
      if (this.productService.productComponents.length - 1 > tabIndex) {
        this.productService.goToProduct(this.productService.productComponents[tabIndex + 1].product.id)

      } else if (tabIndex > 0) {

        this.productService.goToProduct(this.productService.productComponents[tabIndex - 1].product.id)

      } else {

        const selectedItem = this.productService.sideMenuNicheArray.filter(x => x.selectType != null || x.selected == true)[0];

        // If so, remove the selection from that item
        if (selectedItem) {
          selectedItem.selectType = null!;
          selectedItem.selected = null!;
        }
      }
    }

    this.productService.productComponents.splice(tabIndex, 1);
    const productIndex = this.productService.productsContainer.indexOf(product.viewRef);
    this.productService.productsContainer.remove(productIndex);
  }


  closeOthers(product: ProductPropertiesComponent) {
    var index = 0;

    while (this.productService.productComponents.length > 1) {
      if (this.productService.productComponents[index] == product) index = 1;
      const productIndex = this.productService.productsContainer.indexOf(this.productService.productComponents[index].viewRef);
      this.productService.productsContainer.remove(productIndex);
      this.productService.productComponents.splice(index, 1);
    }

    if (product != this.productService.selectedProduct) this.productService.goToProduct(product.product.id)
  }



  closeAll() {
    while (this.productService.productComponents.length > 0) {
      const productIndex = this.productService.productsContainer.indexOf(this.productService.productComponents[0].viewRef);
      this.productService.productsContainer.remove(productIndex);
      this.productService.productComponents.splice(0, 1);
    }

    const selectedItem = this.productService.sideMenuNicheArray.filter(x => x.selectType != null || x.selected == true)[0];

    // If so, remove the selection from that item
    if (selectedItem) {
      selectedItem.selectType = null!;
      selectedItem.selected = null!;
    }
  }


  closeToTheRight(tabIndex: number) {
    var index = 0;

    while (this.productService.productComponents.length > tabIndex + 1) {
      if (index > tabIndex) {

        if (this.productService.productComponents[index] == this.productService.selectedProduct) this.productService.goToProduct(this.productService.productComponents[tabIndex].product.id)

        const productIndex = this.productService.productsContainer.indexOf(this.productService.productComponents[index].viewRef);
        this.productService.productsContainer.remove(productIndex);
        this.productService.productComponents.splice(index, 1);
      }else {
        index++;
      }

    }
  }
}