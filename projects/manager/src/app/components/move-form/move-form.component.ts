import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { ListUpdateType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { PromptComponent } from '../../components/prompt/prompt.component';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'move-form',
  templateUrl: './move-form.component.html',
  styleUrls: ['./move-form.component.scss']
})
export class MoveFormComponent extends LazyLoad {
  private _listUpdate!: ListUpdate;
  public itemToBeMovedType!: string;
  public destinationItemType!: string;
  public itemToBeMoved!: HierarchyItem;
  public fromItem!: HierarchyItem;
  public destinationItem!: HierarchyItem;
  public nicheHierarchy!: Array<HierarchyItem>;
  public listOptions: ListOptions = new ListOptions();
  public destinationList: Array<ListItem> = new Array<ListItem>();
  public get listUpdate(): ListUpdate { return this._listUpdate; }
  public set listUpdate(listUpdate: ListUpdate) { this.onListUpdate(listUpdate); }
  public isOpen: Subject<boolean> = new Subject<boolean>();
  @ViewChild('list') list!: HierarchyComponent;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer) {
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
    this.destinationItem = selectedItem;
  }


  onCancelButtonClick() {
    this.close();
    this.isOpen.next(false);
  }


  onEscape(): void {
    this.onCancelButtonClick();
  }


  onMoveButtonClick() {
    let moveList: Array<HierarchyItem> = new Array<HierarchyItem>();
    let toList: Array<HierarchyItem> = new Array<HierarchyItem>();

    // Get the index of the item-to-be-moved
    let indexOfItemToBeMoved = this.nicheHierarchy.findIndex(x => x.id == this.itemToBeMoved.id && x.name == this.itemToBeMoved.name && x.hierarchyGroupID == this.itemToBeMoved.hierarchyGroupID);

    // If the item-to-be-moved was not found 
    // (This would be because we're searching from the search list and the item-to-be-moved is not visible on the niche hierarchy)
    if (indexOfItemToBeMoved == -1) {
      // Then create the item-to-be-moved
      this.nicheHierarchy.push({
        id: this.itemToBeMoved.id,
        name: this.itemToBeMoved.name,
        hierarchyGroupID: this.itemToBeMoved.hierarchyGroupID,
        isParent: this.itemToBeMoved.isParent
      })
      indexOfItemToBeMoved = this.nicheHierarchy.length - 1;
    }

    // Make a copy of the item-to-be-moved and all its children
    for (let i = indexOfItemToBeMoved; i < this.nicheHierarchy.length; i++) {
      if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfItemToBeMoved].hierarchyGroupID! && i != indexOfItemToBeMoved) break;
      moveList.push(this.nicheHierarchy[i]);
    }

    // Remove the item-to-be-moved and all its children from the niche hierarchy
    this.nicheHierarchy.splice(indexOfItemToBeMoved, moveList.length);

    // Get the index of the item that the item-to-be-moved will be moved to
    const indexOfDestinationItem = this.nicheHierarchy.findIndex(x => x.id == this.destinationItem.id && x.name == this.destinationItem.name && x.hierarchyGroupID == (this.itemToBeMovedType == 'Sub Niche' ? 0 : 1));

    // If the destination-item has its arrow expanded
    if (indexOfDestinationItem != -1 && this.nicheHierarchy[indexOfDestinationItem].arrowDown) {
      // Make a copy of all the children that belongs to that destination-item
      for (let i = indexOfDestinationItem + 1; i < this.nicheHierarchy.length; i++) {
        if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfDestinationItem].hierarchyGroupID! && i != indexOfDestinationItem + 1) break;
        if (this.nicheHierarchy[i].hierarchyGroupID == this.nicheHierarchy[indexOfDestinationItem].hierarchyGroupID! + 1) toList.push(this.nicheHierarchy[i]);
      }

      // Then add the item-to-be-moved to that list
      toList.push(moveList[0]);

      // If the list is allowed to be sorted
      if (this.list.listManager.sortable) {
        // Then sort that list
        // (the purpose of sorting the list is that it lets us know where the item-to-be-moved and its children will be placed)
        toList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
      }

      // Now that the list is sorted, get the index of the item-to-be-moved
      const indexOfSortedItemToBeMoved = toList.indexOf(moveList[0]);

      // If the destination-item is a niche and its sub-niches are expanded (showing their products), then we have to account for the number of products those sub-niches have when placing the item-to-be-moved
      let numChildren = 0;
      for (let i = indexOfDestinationItem + 1 + indexOfSortedItemToBeMoved; i < this.nicheHierarchy.length; i++) {
        if (this.nicheHierarchy[i].hierarchyGroupID! <= this.nicheHierarchy[indexOfDestinationItem + 1].hierarchyGroupID!) break;
        if (this.nicheHierarchy[i].hierarchyGroupID! > this.nicheHierarchy[indexOfDestinationItem].hierarchyGroupID! + 1) numChildren++;
      }

      // Place the item-to-be-moved and its children at its new position
      for (let i = moveList.length - 1; i >= 0; i--) {
        this.nicheHierarchy.splice(indexOfDestinationItem + 1 + indexOfSortedItemToBeMoved + numChildren, 0, moveList[i]);
      }
    }

    let itemToBeMovedType = this.itemToBeMovedType == 'Sub Niche' ? 'Niches' : 'Products';
    // ********* commited Data Service *********
    // this.dataService.put('api/' + itemToBeMovedType + '/Move', {
    //   itemToBeMovedId: this.itemToBeMoved.id,
    //   destinationItemId: this.destinationItem.id
    // }).subscribe(()=> {
      this.openSuccessPrompt();
    // });
  }

  async openSuccessPrompt(){
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../components/prompt/prompt.component');
      const { PromptModule } = await import('../../components/prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.close();
      prompt.title = 'Move Successful';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        

        '<div style="margin-bottom: 4px; display: flex">' +
          '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Moved ' + this.itemToBeMovedType + ':</div>' +
          '<div style="color: #ffba00">' + this.itemToBeMoved.name + '</div>' +
        '</div>' +


        '<div style="margin-bottom: 4px; display: flex">' +
          '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">From ' + this.destinationItemType + ':</div>' +
          '<div style="color: #ffba00">' + this.fromItem.name + '</div>' +
        '</div>' +


        '<div style="margin-bottom: 21px; display: flex">' +
          '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">To ' + this.destinationItemType + ':</div>' +
          '<div style="color: #ffba00">' + this.destinationItem.name + '</div>' +
        '</div>' +


        'The move operation listed above has been completed successfully.' 
        
        );
      prompt.secondaryButton = {
        name: 'Close'
      }

      prompt.onClose.subscribe(() => {
        this.isOpen.next(false);
      })
    })
  }
}