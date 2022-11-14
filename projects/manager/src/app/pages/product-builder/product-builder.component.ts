import { KeyValue } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'product-builder',
  templateUrl: './product-builder.component.html',
  styleUrls: ['./product-builder.component.scss']
})
export class ProductBuilderComponent {
  @ViewChild('productsContainer', { read: ViewContainerRef }) productsContainer!: ViewContainerRef;

  public list: Array<KeyValue<any, any>> = [
    { key: 'Trumpy', value: 45 },
    { key: 'Kari Lake', value: 48 },
    { key: 'Alita', value: 99 },
    { key: 'Musky', value: 1 },
    { key: 'Tyrion', value: 48 },
    { key: 'Daenerys', value: 48 },
    { key: 'Jon Snow', value: 48 },
    { key: 'Cersei', value: 48 },
    { key: 'Sansa', value: 48 },
    { key: 'Arya', value: 48 },
    { key: 'Jaime Lannister', value: 48 },
    { key: 'Jack ONeill', value: 48 },
    { key: 'Tealc', value: 48 },
    { key: 'Daniel Jackson', value: 48 },
    { key: 'Samantha Carter', value: 48 }    
  ];


  // ===================================================================( CONSTRUCTOR )===================================================================== \\

  constructor(public productService: ProductService, private lazyLoadingService: LazyLoadingService) { }



  // ================================================================( NG AFTER VIEW INIT )================================================================= \\

  ngAfterViewInit() {
    this.productService.productsContainer = this.productsContainer;
  }



  // ================================================================( GET TAB LABEL WIDTH )================================================================ \\

  getTabLabelWidth(tabsContainer: HTMLElement) {
    const leftPadding = 10;
    const x = 16;
    const rightPadding = 3;
    const labelWidth = Math.floor((tabsContainer.offsetWidth / this.productService.products.length) - leftPadding - x - rightPadding);
    return labelWidth > 0 ? labelWidth : 0;
  }



  // =================================================================( ON TAB MOUSE DOWN )================================================================= \\

  onTabMouseDown(e: MouseEvent, tabIndex: number) {
    // As long as we're not right clicking on the tab
    if (e.button != 2) {
      // Show the product
      this.showProduct(tabIndex);

      // If we are right clicking on the tab
    } else {

      this.productService.rightClickOnProductTab = true;
      // Open the context menu
      this.openContextMenu(e, tabIndex);
    }
  }



  // ===================================================================( SHOW PRODUCT )==================================================================== \\

  showProduct(tabIndex: number) {
    // As long as we're NOT selecting a tab that is already selected
    if (this.productService.products[tabIndex] != this.productService.selectedProduct) {
      // Show the product
      this.productService.goToProduct(this.productService.products[tabIndex].product.id);
    }
  }



  // =================================================================( OPEN CONTEXT MENU )================================================================= \\

  openContextMenu(e: MouseEvent, tabIndex: number) {
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.productService.productTabContextMenu = contextMenu;
      this.productService.rightClickOnProductTab = false;
      contextMenu.xPos = e.clientX + 5;
      contextMenu.yPos = e.clientY + 5;
      contextMenu.options = this.getContextMenuOptions(tabIndex);

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.productService.productTabContextMenu = null!;
      })
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(tabIndex: number) {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Close',
        optionFunction: () => {
          this.closeProduct(tabIndex);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Close Others',
        isDisabled: this.productService.products.length == 1,
        optionFunction: () => {
          this.closeOthers(tabIndex);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Close All',
        isDisabled: this.productService.products.length == 1,
        optionFunction: () => {
          this.closeAll();
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Close to the Right',
        isDisabled: tabIndex == this.productService.products.length - 1,
        optionFunction: () => {
          this.closeToTheRight(tabIndex);
        }
      }
    ]
  }



  // ===================================================================( CLOSE PRODUCT )=================================================================== \\

  closeProduct(tabIndex: number) {
    // If we're closing a selected tab
    if (this.productService.products[tabIndex] == this.productService.selectedProduct) {

      // If there's a tab to the right
      if (this.productService.products.length - 1 > tabIndex) {
        // Select that tab that's to the right
        this.productService.goToProduct(this.productService.products[tabIndex + 1].product.id)

        // If there's a tab to the left
      } else if (tabIndex > 0) {

        // Select that tab that's to the left
        this.productService.goToProduct(this.productService.products[tabIndex - 1].product.id)

        // If there is NO tab to the left and NO tab to the right
      } else {
        this.unselectListItem();
      }
    }
    // Remove product
    this.removeProduct(tabIndex);
  }



  // ===================================================================( CLOSE OTHERS )==================================================================== \\

  closeOthers(tabIndex: number) {
    var index = 0;
    const product = this.productService.products[tabIndex];

    // Loop until all products are closed except one
    while (this.productService.products.length > 1) {
      // When we come across the tab we (DON'T) want to close
      // Chage the value of the index from 0 to 1
      // This will remove all other tabs becuase the tab we (DON'T) want to close
      // will have an index of 0 and all the rest will eventually get an index of 1
      if (this.productService.products[index] == product) index = 1;

      // Remove product
      this.removeProduct(index);
    }
    // If the tab we (DON'T) want to close was (NOT) selected, then select it now
    if (product != this.productService.selectedProduct) this.productService.goToProduct(product.product.id)
  }



  // =====================================================================( CLOSE ALL )===================================================================== \\

  closeAll() {
    // Loop until all products are closed
    while (this.productService.products.length > 0) {
      // Remove product
      this.removeProduct(0);
    }
    this.unselectListItem();
  }



  // =================================================================( CLOSE TO THE RIGHT )================================================================ \\

  closeToTheRight(tabIndex: number) {
    var index = 0;

    // Loop until all products to the right of the tab we right-clicked on are closed
    while (this.productService.products.length > tabIndex + 1) {
      // If a tab is to the right of the tab we right-clicked on
      if (index > tabIndex) {

        // And that tab happens to be selected,
        // then select the tab we right-clicked on
        if (this.productService.products[index] == this.productService.selectedProduct) this.productService.goToProduct(this.productService.products[tabIndex].product.id)

        // Remove product
        this.removeProduct(index);

        // If a tab is (NOT) to the right of the tab we right-clicked on 
      } else {
        // Keep iterating through each index until we reach a tab that is right of the tab we right-clicked on
        index++;
      }
    }
  }



  // ==================================================================( REMOVE PRODUCT )=================================================================== \\

  removeProduct(index: number) {
    const productIndex = this.productService.productsContainer.indexOf(this.productService.products[index].viewRef);
    this.productService.productsContainer.remove(productIndex);
    this.productService.products.splice(index, 1);
  }



  // ================================================================( UNSELECT LIST ITEM )================================================================= \\

  unselectListItem() {
    // Find the the selected list item in the niche hierarchy of the product that's being closed
    const selectedItem = this.productService.sideMenuNicheArray.filter(x => x.selectType != null || x.selected == true)[0];

    // And unselect that list item
    if (selectedItem) {
      selectedItem.selectType = null!;
      selectedItem.selected = null!;
    }
  }
}