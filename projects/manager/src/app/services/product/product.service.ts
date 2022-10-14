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
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private nicheId!: number;
  private subNicheId!: number;
  private productId!: number;

  public productTabContextMenu!: ContextMenuComponent;
  public zIndex: number = 0;
  public selectedProduct!: ProductPropertiesComponent;
  public productsContainer!: ViewContainerRef;
  public sideMenuNicheArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFilterArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFilterSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public formKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public formProductGroupArray: Array<ListItem> = new Array<ListItem>();
  public formProductGroupSearchArray: Array<ListItem> = new Array<ListItem>();
  public productComponents: Array<ProductPropertiesComponent> = new Array<ProductPropertiesComponent>();
  public onProductSelect: Subject<void> = new Subject<void>();
  public onProductOpen: Subject<ProductPropertiesComponent> = new Subject<ProductPropertiesComponent>();

  
  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) { }


  openProduct(productId: number) {
    this.zIndex++;
    const openedProduct = this.productComponents.find(x => x.product.id == productId);

    // If the product has NOT been opened yet
    if (!openedProduct) {

      this.dataService.get<Product>('api/Products/Product', [{ key: 'productId', value: productId }])
        .subscribe((product: Product) => {
          const productComponentFactory: ComponentFactory<ProductPropertiesComponent> = this.resolver.resolveComponentFactory(ProductPropertiesComponent);
          const productComponentRef = this.productsContainer.createComponent(productComponentFactory);
          const productComponent: ProductPropertiesComponent = productComponentRef.instance;
          productComponentRef.instance.viewRef = productComponentRef.hostView;

          this.productComponents.push(productComponent);
          productComponent.product = product;
          productComponent.zIndex = this.zIndex;
          this.selectedProduct = productComponent;
          this.onProductOpen.next(productComponent);
        })

      // If the product is already open
    } else {
      openedProduct.zIndex = this.zIndex;
      this.selectedProduct = openedProduct;
      this.onProductOpen.next(openedProduct);
    }
  }



  openNotificationProduct(productId: number, notificationItem: NotificationItem) {
    let onProductOpenListener = this.onProductOpen.subscribe((notificationProduct: ProductPropertiesComponent) => {
      onProductOpenListener.unsubscribe();
      window.setTimeout(()=> {
        notificationProduct.openNotificationPopup(notificationItem);
      })
    });

    this.goToProduct(productId);
  }



  goToProduct(productId: number) {
    this.openProduct(productId);

    // If the niches have NOT been loaded yet
    if (this.sideMenuNicheArray.length == 0) {

      // Then first, load the niches into the niches side menu
      this.dataService.get<Array<HierarchyItem>>('api/Categories')
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
  }





  showProductInHierarchy(productId: number) {
    // First, get the id of the niche and the subniche that this product falls under
    this.dataService.get<NicheHierarchy>('api/Products/NicheId_SubNicheId', [{ key: 'productId', value: productId }])
      .subscribe((nicheHierarchy: NicheHierarchy) => {
        this.nicheId = nicheHierarchy.nicheId;
        this.subNicheId = nicheHierarchy.subNicheId;
        this.productId = productId;

        // Then check to see if an item was selected before the niches side menu was last closed
        const selectedItem = this.sideMenuNicheArray.filter(x => x.selectType != null || x.selected == true)[0];

        // If so, remove the selection from that item
        if (selectedItem) {
          selectedItem.selectType = null!;
          selectedItem.selected = null!;
        }

        // Get the index of the niche
        const nicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 0 && x.id == this.nicheId)!;
        this.setHierarchy(nicheIndex, this.subNicheId, 1, this.loadSubNichesAndProducts, [nicheIndex], this.setSubNiche, [nicheIndex], this.setSubNiche, null!);
      })
  }




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







  loadSubNichesAndProducts(nicheIndex: number) {
    // Load all the subNiches of the Niche as well as all the products of the subNiche that the product belongs to
    this.dataService.get<NicheHierarchy>('api/Products/SubNiches_Products', [{ key: 'nicheId', value: this.nicheId }, { key: 'subNicheId', value: this.subNicheId }])
      .subscribe((nicheHierarchy: NicheHierarchy) => {

        // SubNiches
        for (let i = nicheHierarchy.subNiches.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(nicheIndex + 1, 0, this.getHierarchyItem(nicheHierarchy.subNiches[i], 1));
        }

        // And the index of the subNiche
        const subNicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 1 && x.id == this.subNicheId);

        // Products
        for (let i = nicheHierarchy.products.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(subNicheIndex + 1, 0, this.getHierarchyItem(nicheHierarchy.products[i], 2));
        }

        this.onProductSelect.next();
      })
  }


  loadProducts(subNicheIndex: number) {
    // Load the products
    this.dataService.get<Array<HierarchyItem>>('api/Products', [{ key: 'parentId', value: this.subNicheId }])
      .subscribe((products: Array<HierarchyItem>) => {
        for (let i = products.length - 1; i >= 0; i--) {
          this.sideMenuNicheArray.splice(subNicheIndex + 1, 0, this.getHierarchyItem(products[i], 2));
        }
        this.onProductSelect.next();
      })
  }



  getHierarchyItem(hierarchyItem: HierarchyItem, hierarchyGroupID: number): HierarchyItem {
    return {
      id: hierarchyItem.id,
      name: hierarchyItem.name,
      hierarchyGroupID: hierarchyGroupID,
      hidden: false,
      arrowDown: hierarchyGroupID == 1 && hierarchyItem.id == this.subNicheId ? true : false,
      selected: hierarchyGroupID == 2 && hierarchyItem.id == this.productId ? true : false,
      isParent: hierarchyGroupID == 2 ? false : true,
      case: CaseType.TitleCase
    }
  }



  setSubNiche(nicheIndex: number) {
    if (nicheIndex) this.unhide(nicheIndex);

    // Get the index of the subNiche
    const subNicheIndex: number = this.sideMenuNicheArray.findIndex(x => x.hierarchyGroupID == 1 && x.id == this.subNicheId);
    this.setHierarchy(subNicheIndex, this.productId, 2, this.loadProducts, [subNicheIndex], this.selectProduct, [subNicheIndex], this.selectProduct, nicheIndex ? [subNicheIndex] : null!);
  }




  selectProduct(subNicheIndex: number) {
    if (subNicheIndex) this.unhide(subNicheIndex);

    const product: HierarchyItem = this.sideMenuNicheArray.find(x => x.hierarchyGroupID == 2 && x.id == this.productId)!;
    product.selected = true;
  }



  unhide(index: number) {
    for (let i = index + 1; i < this.sideMenuNicheArray.length; i++) {
      if (this.sideMenuNicheArray[i].hierarchyGroupID == this.sideMenuNicheArray[index].hierarchyGroupID! + 1) {
        this.sideMenuNicheArray[i].hidden = false;
      }
      if (this.sideMenuNicheArray[i].hierarchyGroupID! <= this.sideMenuNicheArray[index].hierarchyGroupID!) break;
    }
  }
}