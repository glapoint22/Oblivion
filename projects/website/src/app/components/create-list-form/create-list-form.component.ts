import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { List } from '../../classes/list';
import { Product } from '../../classes/product';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';

@Component({
  selector: 'create-list-form',
  templateUrl: './create-list-form.component.html',
  styleUrls: ['./create-list-form.component.scss']
})
export class CreateListFormComponent extends Validation implements OnInit {
  public addToListForm!: AddToListFormComponent;
  public product!: Product;
  @Output() onListCreated: EventEmitter<List> = new EventEmitter();

  constructor
    (
      dataService: DataService,
      private accountService: AccountService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(dataService); }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      listName: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),
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
        { authorization: true }
      ).subscribe((list: List) => {
        this._close();
        this.onListCreated.emit(new List(
          list.id,
          this.form.get('listName')?.value,
          this.form.get('description')?.value,
          list.collaborateId,
          this.accountService.customer?.profileImage
        ));
      });
    }
  }


  async openAddToListForm() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
    const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

    this.lazyLoadingService.getComponentAsync(AddToListFormComponent, AddToListFormModule, this.lazyLoadingService.container)
      .then((addToListForm: AddToListFormComponent) => {
        addToListForm.product = this.product;
        addToListForm.createListForm = this;
      });
  }


  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this._close();
    }
  }


  _close() {
    if (!this.addToListForm) {
      super.close()
    } else {
      super.fade();
      this.openAddToListForm();
    }
  }
}