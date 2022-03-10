import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListManager } from '../../../classes/list-manager';
import { ListItem } from '../../../classes/list-item';
import { ListOptions } from '../../../classes/list-options';
import { ListUpdate } from '../../../classes/list-update';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public listManager!: ListManager;
  public options: ListOptions = new ListOptions();
  @Input() sourceList!: Array<ListItem>;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();

  
  private _overButton! : boolean;
  public get overButton() : boolean {
    return this._overButton;
  }
  public set overButton(v : boolean) {
    this._overButton = v;
    this.listManager.overButton = v;
  }
  


  instantiate() {
    this.listManager = new ListManager();
  }


  ngOnInit(): void {
    this.instantiate();
    this.listManager.sourceList = this.sourceList;
    this.listManager.options = this.options = {addDisabled: false, editDisabled: true, deleteDisabled: true};

    this.listManager.onListUpdate.subscribe((listUpdate) => {
      this.onListUpdate.emit(listUpdate);
    });
  }



  ngAfterViewInit() {
    window.setTimeout(() => {
      this.listManager.onListUpdate.next({ addDisabled: this.options.addDisabled, editDisabled: this.options.editDisabled, deleteDisabled: this.options.deleteDisabled });
    })
  }



  addItem(id?: number, name?: string) {
    // Add the new item to the source list
    this.sourceList.push({ id: id!, name: name! });

    // Sort the list
    this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

    window.setTimeout(() => {
      this.listManager.setAddItem(this.sourceList.find(x => x.id == id)!);
    })
  }




  deleteItem() {
    this.listManager.setDeleteItem();
  }
}