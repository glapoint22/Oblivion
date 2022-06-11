import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListManager } from '../../../classes/list-manager';
import { ListItem } from '../../../classes/list-item';
import { ListOptions } from '../../../classes/list-options';
import { ListUpdate } from '../../../classes/list-update';
import { LazyLoadingService } from 'common';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public listManager!: ListManager;
  @Input() sourceList!: Array<ListItem>;
  @Input() options: ListOptions = new ListOptions();
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();
  constructor(public lazyLoadingService: LazyLoadingService) { }


  private _overButton!: boolean;
  public get overButton(): boolean {
    return this._overButton;
  }
  public set overButton(v: boolean) {
    this._overButton = v;
    this.listManager.overButton = v;
  }



  instantiate() {
    this.listManager = new ListManager(this.lazyLoadingService);
  }


  ngOnInit(): void {
    this.instantiate();
    this.listManager.sourceList = this.sourceList;
    this.listManager.onListUpdate.subscribe((listUpdate) => {
      this.onListUpdate.emit(listUpdate);
    });
  }



  ngAfterViewInit() {
    window.setTimeout(() => {
      this.setListOptions();
    }, 100)
  }


  setListOptions() {
    if (this.options) {
      this.listManager.options = this.options;
      if (this.options.editable != null) this.listManager.editable = this.options.editable;
      if (this.options.selectable != null) this.listManager.selectable = this.options.selectable;
      if (this.options.unselectable != null) this.listManager.unselectable = this.options.unselectable;
      if (this.options.deletable != null) this.listManager.deletable = this.options.deletable;
      if (this.options.multiselectable != null) this.listManager.multiselectable = this.options.multiselectable;
      if (this.options.sortable != null) this.listManager.sortable = this.options.sortable;
      if (this.options.verifyAddEdit != null) this.listManager.verifyAddEdit = this.options.verifyAddEdit;
    }
    this.initializeListUpdate();
  }


  initializeListUpdate() {
    this.listManager.onListUpdate.next(
      {
        addDisabled: this.listManager.addDisabled,
        editDisabled: this.listManager.editDisabled,
        deleteDisabled: this.listManager.deleteDisabled
      }
    )
  }


  add(id?: number, name?: string) {
    // If the list is NOT Editable (the id and name of the new item will already be defined)
    if (!this.listManager.editable) {
      // Add the new item to the list
      this.sourceList.push({ id: id!, name: name! });

      // As long as the list is set to be sortable
      if (this.listManager.sortable) {
        // Sort the list
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
      }
      // Send it to the list manager to be selected
      this.listManager.setAddItem(this.sourceList.find(x => x.id == id && x.name == name)!);



      // If the list IS editable
    } else {
      // Add the new item to the top of the list
      this.sourceList.unshift({ id: -1, name: '' });

      // Wait for the html-item property to be assigned to the new item
      window.setTimeout(() => {
        // Send it to the list manager to get the focus so it can be edited
        this.listManager.setAddItem(this.sourceList[0]);
      })
    }
  }


  edit() {
    this.listManager.setEditItem(this.listManager.selectedItem);
  }



  delete() {
    this.listManager.setDelete();
  }


  commitAddEdit() {
    this.listManager.commitAddEdit();
  }


  openDuplicatePrompt() {
    this.listManager.openPrompt(this.listManager.options.duplicatePrompt!);
  }
}