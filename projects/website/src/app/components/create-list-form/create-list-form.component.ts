import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { List } from '../../classes/list';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'create-list-form',
  templateUrl: './create-list-form.component.html',
  styleUrls: ['./create-list-form.component.scss']
})
export class CreateListFormComponent extends Validation implements OnInit {
  @Output() onListCreated: EventEmitter<List> = new EventEmitter();

  constructor(private dataService: DataService, private accountService: AccountService, private router: Router) { super(); }

  ngOnInit(): void {
    this.form = new FormGroup({
      listName: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataService.post<List>('api/Lists',
        {
          name: this.form.get('listName')?.value,
          description: this.form.get('description')?.value
        },
        this.accountService.getHeaders()
      ).subscribe((list: List) => {
        this.close();
        this.onListCreated.emit(new List(
          list.id,
          this.form.get('listName')?.value,
          this.form.get('description')?.value,
          list.collaborateId,
          {
            name: this.accountService.customer?.firstName + ' ' + this.accountService.customer?.lastName,
            url: this.accountService.getProfileImg()
          }
        ));
      });
    }
  }
}