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


      if (this.options) {
        this.listManager.options = this.options;
        if (this.options.editable != null) this.listManager.editable = this.options.editable;
        if (this.options.selectable != null) this.listManager.selectable = this.options.selectable;
        if (this.options.unselectable != null) this.listManager.unselectable = this.options.unselectable;
        if (this.options.deletable != null) this.listManager.deletable = this.options.deletable;
        if (this.options.multiselectable != null) this.listManager.multiselectable = this.options.multiselectable;
      }


      this.listManager.onListUpdate.next({ addDisabled: this.listManager.addDisabled, editDisabled: this.listManager.editDisabled, deleteDisabled: this.listManager.deleteDisabled });
    },100)
  }



  add(id?: number, name?: string) {

    // NOT Editable
    if (!this.listManager.editable) {

      // Add the new item to the source list
      this.sourceList.push({ id: id!, name: name! });


      window.setTimeout(() => {
        const identity = this.sourceList[this.sourceList.length - 1].identity;

        // Sort the list
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        window.setTimeout(() => {
          this.listManager.setAddItem(this.sourceList.find(x => x.identity == identity)!);
        })

      })





      // Editable
    } else {

      this.sourceList.unshift({ id: -1, name: '' });

      window.setTimeout(() => {
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


  openPrompt() {
    this.listManager.openPrompt();
  }
}