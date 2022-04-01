import { Component, ViewChild } from '@angular/core';
import { NgControlStatus } from '@angular/forms';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { Subject } from 'rxjs';
import { ListUpdateType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'move-form',
  templateUrl: './move-form.component.html',
  styleUrls: ['./move-form.component.scss']
})
export class MoveFormComponent extends LazyLoad {
  private _listUpdate!: ListUpdate;
  public moveItemType!: string;
  public toItemType!: string;

  public moveItem!: HierarchyItem;
  public fromItem!: HierarchyItem;
  public toItem!: HierarchyItem;

  public nicheHierarchy!: Array<HierarchyItem>;


  public listOptions: ListOptions = new ListOptions();
  public destinationList: Array<ListItem> = new Array<ListItem>();
  public get listUpdate(): ListUpdate { return this._listUpdate; }
  public set listUpdate(listUpdate: ListUpdate) { this.onListUpdate(listUpdate); }
  public isOpen: Subject<boolean> = new Subject<boolean>();
  @ViewChild('list') list!: HierarchyComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.listOptions = {
      unselectable: false,
      multiselectable: false
    }
  }


  onListUpdate(listUpdate: ListUpdate) {
    this._listUpdate = listUpdate;
    if (listUpdate.type == ListUpdateType.SelectedItems) this.onSelectedItem(listUpdate.selectedItems![0]);
  }


  onSelectedItem(selectedItem: ListItem) {
    this.toItem = selectedItem;
  }

  close(): void {
    super.close();
    this.isOpen.next(false);
  }


  onMove() {
    this.close();
    let moveList: Array<HierarchyItem> = new Array<HierarchyItem>();
    let toList: Array<HierarchyItem> = new Array<HierarchyItem>();

    // Get the index of the item-to-be-moved
    const indexOfItemToBeMoved = this.nicheHierarchy.findIndex(x => x == this.moveItem);

    // Make a copy of the item-to-be-moved and all its children
    for (let i = indexOfItemToBeMoved; i < this.nicheHierarchy.length; i++) {
      if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfItemToBeMoved].hierarchyGroupID! && i != indexOfItemToBeMoved) break;
      moveList.push(this.nicheHierarchy[i]);
    }

    // Remove the item-to-be-moved and all its children from the niche hierarchy
    this.nicheHierarchy.splice(indexOfItemToBeMoved, moveList.length);

    // Get the index of the item that the item-to-be-moved will be moved to
    const indexOfMoveToItem = this.nicheHierarchy.findIndex(x => x.id == this.toItem.id && x.name == this.toItem.name);

    // If the move-to-item has its arrow expanded
    if (indexOfMoveToItem != -1 && this.nicheHierarchy[indexOfMoveToItem].arrowDown) {
      // Make a copy of all the children that belongs to the move-to-item
      for (let i = indexOfMoveToItem + 1; i < this.nicheHierarchy.length; i++) {
        if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfMoveToItem].hierarchyGroupID! && i != indexOfMoveToItem + 1) break;

        if (this.nicheHierarchy[i].hierarchyGroupID == this.nicheHierarchy[indexOfMoveToItem].hierarchyGroupID! + 1) toList.push(this.nicheHierarchy[i]);
      }

      // Add the item-to-be-moved to that list
      toList.push(moveList[0]);

      // Then sort that list
      toList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

      // Now that the list is sorted, get the index of the item-to-be-moved
      // (sorting the list lets us know where the item-to-be-moved and its children will be placed)
      const indexOfSortedItemToBeMoved = toList.indexOf(moveList[0]);

      // If the move-to-item is a niche and its sub-niches are expanded, we have to account for the number of products those sub-niches have when placing the item-to-be-moved
      let numChildren = 0;
      for (let i = indexOfMoveToItem + 1 + indexOfSortedItemToBeMoved; i < this.nicheHierarchy.length; i++) {
        if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfMoveToItem + 1].hierarchyGroupID!) break;
        if (this.nicheHierarchy[i].hierarchyGroupID! > this.nicheHierarchy[indexOfMoveToItem].hierarchyGroupID! + 1) numChildren++;
      }


      // Place the item-to-be-moved and its children at its new position
      for (let i = moveList.length - 1; i >= 0; i--) {
        this.nicheHierarchy.splice(indexOfMoveToItem + 1 + indexOfSortedItemToBeMoved + numChildren, 0, moveList[i]);
      }
    }

    let moveItemType = this.moveItem.hierarchyGroupID == 1 ? 'Niches' : 'Products';

    this.dataService.put('api/' + moveItemType + '/Move', {
      MoveItemId: this.moveItem.id,
      ParentItemId: this.toItem.id
    }).subscribe();
  }
}