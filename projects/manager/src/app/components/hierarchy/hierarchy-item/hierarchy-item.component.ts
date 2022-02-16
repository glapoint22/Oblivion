import { Component, Input } from '@angular/core';
import { HierarchyType } from '../../../classes/hierarchy';
import { HierarchyItem } from '../../../classes/hierarchy-item';

@Component({
  selector: 'hierarchy-item',
  templateUrl: './hierarchy-item.component.html',
  styleUrls: ['./hierarchy-item.component.scss']
})
export class HierarchyItemComponent {
  @Input() rootHierarchyItem!: HierarchyItem;
  @Input() hierarchyItem!: HierarchyItem;
  @Input() hierarchyType!: HierarchyType;
  public HierarchyType = HierarchyType;
  public overArrow!: boolean;
  public get isRoot(): boolean {
    return this.rootHierarchyItem.children.some(x => x == this.hierarchyItem);
  }

  
  ngOnInit() {
    if (!this.hierarchyItem.name) this.rootHierarchyItem = this.hierarchyItem;
  }



  onArrowClick() {
    this.hierarchyItem.expanded = !this.hierarchyItem.expanded;

    if (this.hierarchyItem.children) {
      this.hierarchyItem.children.forEach(x => {
        x.hidden = !this.hierarchyItem.expanded;
      });
    }
  }


  onHierarchyItemClick() {
    if (!this.overArrow) {
      this.unselectHierarchyItems(this.rootHierarchyItem);
      this.hierarchyItem.selected = true;
    }
  }



  unselectHierarchyItems(hierarchyItem: HierarchyItem) {
    if (hierarchyItem.children) {

      for (let i = 0; i < hierarchyItem.children.length; i++) {
        hierarchyItem.children[i].selected = false;
        this.unselectHierarchyItems(hierarchyItem.children[i]);
      }
    }
  }
}