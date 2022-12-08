import { ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { DataService } from 'common';
import { Subject } from 'rxjs';
import { CaseType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListItem } from '../../classes/list-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { NicheHierarchy } from '../../classes/niche-hierarchy';
import { NotificationItem } from '../../classes/notifications/notification-item';
import { Product } from '../../classes/product';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ProductFormComponent } from '../../components/product/product-form/product-form.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private nicheId!: number;
  private subnicheId!: number;
  private productId!: number;
  private onProductLoad: Subject<void> = new Subject<void>();
  private onProductOpen: Subject<ProductFormComponent> = new Subject<ProductFormComponent>();

  public rightClickOnProductTab!: boolean;
  public productTabContextMenu!: ContextMenuComponent;
  public zIndex: number = 0;
  public selectedProduct!: ProductFormComponent;
  public productsContainer!: ViewContainerRef;
  public sideMenuNicheArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFilterArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFilterSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public formKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public formProductGroupArray: Array<ListItem> = new Array<ListItem>();
  public formProductGroupSearchArray: Array<ListItem> = new Array<ListItem>();
  public products: Array<ProductFormComponent> = new Array<ProductFormComponent>();
  public onProductSelect: Subject<void> = new Subject<void>();

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) { }


  // ===================================================================( GO TO PRODUCT )=================================================================== \\

  goToProduct(productId: number) {
    const onProductLoadListener = this.onProductLoad.subscribe(() => {
      onProductLoadListener.unsubscribe();

      // If the niches have NOT been loaded yet
      if (this.sideMenuNicheArray.length == 0) {

        // Then first, load the niches into the niches side menu
        this.dataService.get<Array<HierarchyItem>>('api/Niches')
          .subscribe((niches: Array<HierarchyItem>) => {
            niches.forEach(x => {
              this.sideMenuNicheArray.push(
                {
                  id: x.id,
                  name: x.name,
                  hierarchyGroupID: 0,
                  hidden: false,
                  arrowDown: false
                }
              );
            })
            // Show the product in the niches side menu hierarchy
            this.showProductInHierarchy(productId);
          })

        // If the niches have already been loaded into the niches side menu
      } else {
        // Show the product in the niches side menu hierarchy
        this.showProductInHierarchy(productId);
      }
    });
    this.openProduct(productId);
  }



  // ===================================================================( OPEN PRODUCT )==================================================================== \\

  openProduct(productId: number) {
    this.productId = productId;
    this.zIndex++;
    const openedProduct = this.products.find(x => x.product.id == productId);

    // If the product has NOT been opened yet
    if (!openedProduct) {

      this.dataService.get<Product>('api/Products/Product', [{ key: 'productId', value: productId }], {
        authorization: true
      })
        .subscribe((product: Product) => {
          this.nicheId = product.niche.id!;
          this.subnicheId = product.subniche.id!;
          const productComponentFactory: ComponentFactory<ProductFormComponent> = this.resolver.resolveComponentFactory(ProductFormComponent);
          const productComponentRef = this.productsContainer.createComponent(productComponentFactory);
          const productComponent: ProductFormComponent = productComponentRef.instance;
          productComponentRef.instance.viewRef = productComponentRef.hostView;

          this.products.push(productComponent);
          productComponent.product = product;
          productComponent.zIndex = this.zIndex;
          this.selectedProduct = productComponent;
          this.onProductOpen.next(productComponent);
          this.onProductLoad.next();

          // If the product's name happened to be renamed in the hierarchy list, then we need to check to see if its name
          // was updated in the database first before it was retrieved
          const productListItem = this.sideMenuNicheArray.find(x => x.id == productId && x.hierarchyGroupID == 2);

          if (productListItem) {
            // If the product's name from the database is NOT the same as the product's name in the hierarchy list
            // then that means the product was retrieved from the database before its name got updated
            if (product.name != productListItem) {
              // Update the name of the product (name on the tab and name on the form) 
              this.products[this.products.length - 1].product.name = productListItem.name!;
            }
          }
        })

      // If the product is already open
    } else {
      this.nicheId = openedProduct.product.niche.id!;
      this.subnicheId = openedProduct.product.subniche.id!;
      openedProduct.zIndex = this.zIndex;
      this.selectedProduct = openedProduct;
      this.onProductLoad.next();
      this.onProductOpen.next(openedProduct);
    }
  }



  // ============================================================( OPEN NOTIFICATION PRODUCT )============================================================== \\

  openNotificationProduct(productId: number, notificationItem: NotificationItem) {
    const onProductOpenListener = this.onProductOpen.subscribe((notificationProduct: ProductFormComponent) => {
      onProductOpenListener.unsubscribe();
      notificationProduct.openNotificationPopup(notificationItem);
    });
    this.goToProduct(productId);
  }



  // ============================================================( SHOW PRODUCT IN HIERARCHY )============================================================== \\

  showProductInHierarchy(productId: number) {
    // Then check to see if an item was selected before the niches side menu was last closed
    const selectedItem = this.sideMenuNicheArray.filter(x => x.selectType != null || x.selected == true)[0];

    // If so, remove the selection from that item
    if (selectedItem) {
      selectedItem.selectType = null!;
      selectedItem.selected = null!;
    }

    // Get the index of the niche
    const nicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 0 && x.id == this.nicheId)!;
    this.setHierarchy(nicheIndex, this.subnicheId, 1, this.loadSubNichesAndProducts, [nicheIndex], this.setSubNiche, [nicheIndex], this.setSubNiche, null!);
  }



  // ===================================================================( SET HIEARCHY )==================================================================== \\

  setHierarchy(parentIndex: number, childId: number, childHierarchyGroupID: number, childrenNotLoaded: Function, childrenNotLoadedParameters: Array<any>, childrenLoaded: Function, childrenLoadedParameters: Array<any>, func3: Function, func3Parameters: Array<any>) {

    // If the parent does NOT have its arrow down
    if (!this.sideMenuNicheArray[parentIndex].arrowDown) {

      // Then set the arrow down for that parent
      this.sideMenuNicheArray[parentIndex].arrowDown = true;

      // And then check to see if the parent ever had its children loaded
      const child: HierarchyItem = this.sideMenuNicheArray.find(x => x.hierarchyGroupID == childHierarchyGroupID && x.id == childId)!;

      // If the children were NOT loaded
      if (!child) childrenNotLoaded.apply(this, childrenNotLoadedParameters);

      // If the children were loaded
      if (child) childrenLoaded.apply(this, childrenLoadedParameters);

      // If the arrow of the parent is already down
    } else {
      func3.apply(this, func3Parameters);
    }
  }



  // ===========================================================( LOAD SUB NICHES AND PRODUCTS )============================================================ \\

  loadSubNichesAndProducts(nicheIndex: number) {
    // Load all the subNiches of the Niche as well as all the products of the subNiche that the product belongs to
    this.dataService.get<NicheHierarchy>('api/Products/SubNiches_Products', [{ key: 'nicheId', value: this.nicheId }, { key: 'subNicheId', value: this.subnicheId }])
      .subscribe((nicheHierarchy: NicheHierarchy) => {

        // SubNiches
        for (let i = nicheHierarchy.subNiches.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(nicheIndex + 1, 0, this.getHierarchyItem(nicheHierarchy.subNiches[i], 1));
        }

        // And the index of the subNiche
        const subNicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 1 && x.id == this.subnicheId);

        // Products
        for (let i = nicheHierarchy.products.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(subNicheIndex + 1, 0, this.getHierarchyItem(nicheHierarchy.products[i], 2));
        }
        this.onProductSelect.next();
      })
  }



  // ==================================================================( LOAD PRODUCTS )==================================================================== \\

  loadProducts(subNicheIndex: number) {
    // Load the products
    this.dataService.get<Array<HierarchyItem>>('api/Products', [{ key: 'parentId', value: this.subnicheId }])
      .subscribe((products: Array<HierarchyItem>) => {
        for (let i = products.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(subNicheIndex + 1, 0, this.getHierarchyItem(products[i], 2));
        }
        this.onProductSelect.next();
      })
  }



  // ================================================================( GET HIERARCHY ITEM )================================================================= \\

  getHierarchyItem(hierarchyItem: HierarchyItem, hierarchyGroupID: number): HierarchyItem {
    return {
      id: hierarchyItem.id,
      name: hierarchyItem.name,
      hierarchyGroupID: hierarchyGroupID,
      hidden: false,
      arrowDown: hierarchyGroupID == 1 && hierarchyItem.id == this.subnicheId ? true : false,
      selected: hierarchyGroupID == 2 && hierarchyItem.id == this.productId ? true : false,
      isParent: hierarchyGroupID == 2 ? false : true,
      case: CaseType.TitleCase
    }
  }



  // ==================================================================( SET SUB NICHE )==================================================================== \\

  setSubNiche(nicheIndex: number) {
    if (nicheIndex) this.unhide(nicheIndex);

    // Get the index of the subNiche
    const subNicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 1 && x.id == this.subnicheId);
    this.setHierarchy(subNicheIndex, this.productId, 2, this.loadProducts, [subNicheIndex], this.selectProduct, [subNicheIndex], this.selectProduct, nicheIndex ? [subNicheIndex] : null!);
  }



  // ==================================================================( SELECT PRODUCT )=================================================================== \\

  selectProduct(subNicheIndex: number) {
    if (subNicheIndex) this.unhide(subNicheIndex);

    const product: HierarchyItem = this.sideMenuNicheArray.find(x => x.hierarchyGroupID == 2 && x.id == this.productId)!;
    product.selected = true;
  }



  // ======================================================================( UNHIDE )======================================================================= \\

  unhide(index: number) {
    for (let i = index + 1; i < this.sideMenuNicheArray.length; i++) {
      if (this.sideMenuNicheArray[i].hierarchyGroupID == this.sideMenuNicheArray[index].hierarchyGroupID! + 1) {
        this.sideMenuNicheArray[i].hidden = false;
      }
      if (this.sideMenuNicheArray[i].hierarchyGroupID! <= this.sideMenuNicheArray[index].hierarchyGroupID!) break;
    }
  }



  // =======================================================================( SORT )======================================================================== \\

  sort(hierarchyItem: HierarchyItem, array: Array<HierarchyItem>) {
    let parentHierarchyIndex: number = -1;
    let tempArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    let newHierarchyGroup: Array<HierarchyItem> = new Array<HierarchyItem>();

    // If the selected hierarchy item belongs to the top level group
    if (hierarchyItem.hierarchyGroupID == 0) {
      // Copy all the hierarchy items from that group to the temp array
      tempArray = (array as Array<HierarchyItem>).filter(x => x.hierarchyGroupID == 0);

      // If the selected hierarchy item belongs to any other group
    } else {

      // First get the parent of the selected hierarchy item
      parentHierarchyIndex = this.getIndexOfHierarchyItemParent(hierarchyItem, array);

      // Then copy all the children belonging to that hierarchy parent to the temp array
      for (let i = parentHierarchyIndex + 1; i < array.length; i++) {
        if (array[i].hierarchyGroupID == array[parentHierarchyIndex].hierarchyGroupID) break;
        if (array[i].hierarchyGroupID == array[parentHierarchyIndex].hierarchyGroupID! + 1) {
          tempArray.push(array[i] as HierarchyItem)
        }
      }
    }

    // Sort the temp array
    tempArray.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

    // Loop through all the hierarchy items in the temp array
    tempArray.forEach(x => {
      // Get the index of that same hierarchy item from the source list
      let index = array.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == x.hierarchyGroupID);

      // Copy the hierarchy item and all its children
      for (let i = index; i < array.length; i++) {
        if (i != index && array[i].hierarchyGroupID! <= array[index].hierarchyGroupID!) break;

        // And add them to the new hierarchy group
        newHierarchyGroup.push(array[i] as HierarchyItem);
      }
    })

    // Remove the old hierarchy group from the source
    array.splice(parentHierarchyIndex + 1, newHierarchyGroup.length);
    // Add the new hierarchy group to the source
    array.splice(parentHierarchyIndex + 1, 0, ...newHierarchyGroup);
  }



  // ========================================================( GET INDEX OF HIERARCHY ITEM PARENT )========================================================= \\

  getIndexOfHierarchyItemParent(hierarchyItem: HierarchyItem, array: Array<HierarchyItem>): number {
    let parentHierarchyIndex!: number;
    const hierarchyItemIndex = array.indexOf(hierarchyItem);

    for (let i = hierarchyItemIndex; i >= 0; i--) {
      if (array[i].hierarchyGroupID! < array[hierarchyItemIndex].hierarchyGroupID!) {
        parentHierarchyIndex = i;
        break;
      }
    }
    return parentHierarchyIndex;
  }
}