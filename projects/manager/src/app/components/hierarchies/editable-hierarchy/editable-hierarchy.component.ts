import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { EditableArrowListManager } from '../../../classes/editable-arrow-list-manager';
import { Hierarchy } from '../../../classes/hierarchy';
import { ListUpdate } from '../../../classes/list-update';
import { ItemComponent } from '../../items/item/item.component';

@Component({
  selector: 'editable-hierarchy',
  templateUrl: './editable-hierarchy.component.html',
  styleUrls: ['./editable-hierarchy.component.scss']
})
export class EditableHierarchyComponent {
  public listManager!: EditableArrowListManager;
  @Input() hierarchy!: Array<Hierarchy>;
  @ViewChildren('item') items!: QueryList<ItemComponent>;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();


  ngOnInit() {
    this.listManager = new EditableArrowListManager();
    this.listManager.sourceList = this.hierarchy;

    this.listManager.onListUpdate.subscribe((listUpdate) => {
      this.onListUpdate.emit(listUpdate);
    });
  }



  ngAfterViewInit() {
    this.listManager.items = this.items;
  }
}