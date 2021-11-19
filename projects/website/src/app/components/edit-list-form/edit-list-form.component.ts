import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { List } from '../../classes/list';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'edit-list-form',
  templateUrl: './edit-list-form.component.html',
  styleUrls: ['./edit-list-form.component.scss']
})
export class EditListFormComponent extends Validation implements OnInit {
  @Output() onInit: EventEmitter<void> = new EventEmitter();
  public list!: List;

  constructor(private dataService: DataService, private accountService: AccountService) {super()}

  ngOnInit(): void {
    this.form = new FormGroup({
      listName: new FormControl('', [ Validators.required]),
      description: new FormControl('')
    });

    this.onInit.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dataService.put<List>('api/Lists', {
        id: this.list.id,
        name: this.form.get('listName')?.value,
        description: this.form.get('description')?.value
      }, this.accountService.getHeaders()).subscribe((list: List) => {
        this.list.name = list.name;
        this.list.description = list.description;
        this.close();
      });
    }
  }
}