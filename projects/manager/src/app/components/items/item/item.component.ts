import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ItemSelectType } from '../../../classes/enums';
import { List, ListUpdate } from '../../../classes/list';
import { ListItem } from '../../../classes/list-item';
import { ListOptions } from '../../../classes/list-options';
import { ListService } from '../../../services/list/list.service';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges {
  public selected!: boolean;
  public selectType!: ItemSelectType | null;
  public SelectType = ItemSelectType;
  public list!: List;
  @Input() source!: Array<ListItem>;
  @Input() item!: ListItem;
  @Input() options!: ListOptions;
  @Input() listChange!: ListUpdate;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();
  @ViewChild('htmlItem') htmlItem!: ElementRef<HTMLElement>;
  constructor(public listService: ListService) { }


  ngOnInit(): void {
    // If an instance of list has NOT been created yet
    if (!this.listService.instances.find(x => x.instanceId == this.source)) {
      // Create an instance
      this.listService.instances.push(this.list = new List());
      // Link the source to the instance id so other items in the list can reference this instance
      this.listService.instances[this.listService.instances.length - 1].instanceId = this.source;
      this.listService.instances[this.listService.instances.length - 1].options = this.options;

      // If an instance has already been created
    } else {

      // Share the instance with the other items in the list
      this.list = this.listService.instances.find(x => x.instanceId == this.source)!;
    }
    this.list.itemComponents.push(this);
  }


  ngAfterViewInit() {
    this.list.htmlItems.push(this.htmlItem);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['listChange'].firstChange) {
      if (this == this.list.itemComponents[0]) {
        if (this.listChange.add != null) this.list.addItem(this.listChange.add[0].id);
        if (this.listChange.edit != null) this.list.editItem();
        if (this.listChange.delete != null) this.list.deleteItem();
        if (this.listChange.preventUnselect != null) this.list.preventUnselect = this.listChange.preventUnselect;
      }
    }
  }
}