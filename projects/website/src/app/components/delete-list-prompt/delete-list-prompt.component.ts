import { Component, EventEmitter, Output } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { List } from '../../classes/list';

@Component({
  selector: 'delete-list-prompt',
  templateUrl: './delete-list-prompt.component.html',
  styleUrls: ['./delete-list-prompt.component.scss']
})
export class DeleteListPromptComponent extends LazyLoad {
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  public list!: List;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onDeleteClick() {
    this.dataService.delete('api/Lists/DeleteList', { listId: this.list.id }, {
      authorization: true,
      spinnerAction: SpinnerAction.StartEnd
    })
      .subscribe(() => {
        this.onDelete.emit();
        this.close();
      });
  }
}