import { Component, ViewChild, ViewRef } from '@angular/core';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { MultiColumnItem } from '../../../classes/multi-column-item';
import { Product } from '../../../classes/product';
import { CheckboxMultiColumnItem } from '../../../classes/checkbox-multi-column-item';
import { CheckboxItem } from '../../../classes/checkbox-item';
import { KeywordCheckboxItem } from '../../../classes/keyword-checkbox-item';
import { KeywordCheckboxMultiColumnItem } from '../../../classes/keyword-checkbox-multi-column-item';
import { ProductMedia } from '../../../classes/product-media';
import { ProductCircleButtonsComponent } from '../product-circle-buttons/product-circle-buttons.component';

@Component({
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  public zIndex!: number;
  public viewRef!: ViewRef;
  public product: Product = new Product();
  public selectedProductMedia!: ProductMedia;
  public productFilterArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public availableKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productProductGroupArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productProductGroupSearchArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public availableKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedKeywordArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public productFilterSearchArray: Array<CheckboxMultiColumnItem> = new Array<CheckboxMultiColumnItem>();
  public selectedKeywordSearchArray: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();
  @ViewChild('circleButtons') circleButtons!: ProductCircleButtonsComponent;
}