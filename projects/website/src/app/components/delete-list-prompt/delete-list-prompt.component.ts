import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'delete-list-prompt',
  templateUrl: './delete-list-prompt.component.html',
  styleUrls: ['./delete-list-prompt.component.scss']
})
export class DeleteListPromptComponent extends LazyLoad {
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  public list!: List;

  constructor(private dataService: DataService, private accountService: AccountService) { super(); }

  onDeleteClick() {
    this.dataService.delete('api/Lists', { listId: this.list.id }, this.accountService.getHeaders())
      .subscribe(() => {
        this.onDelete.emit();
        this.close();
      });
  }
}