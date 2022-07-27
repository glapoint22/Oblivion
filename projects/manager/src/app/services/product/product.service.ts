import { Injectable, ViewContainerRef } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { ProductPropertiesComponent } from '../../components/product-properties/product-properties.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public zIndex: number = 0;
  public productsContainer!: ViewContainerRef;


  public sideMenuNicheArray: Array<HierarchyItem> = new Array<HierarchyItem>();

  public formFilterArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formFilterSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();

  public formProductGroupArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formProductGroupSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();


  public productComponents: Array<ProductPropertiesComponent> = new Array<ProductPropertiesComponent>();
}