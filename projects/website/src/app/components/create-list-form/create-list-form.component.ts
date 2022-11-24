import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction, SummaryProduct } from 'common';
import { List } from '../../classes/list';
import { Validation } from '../../classes/validation';
import { AddToListFormComponent } from '../add-to-list-form/add-to-list-form.component';

@Component({
  selector: 'create-list-form',
  templateUrl: './create-list-form.component.html',
  styleUrls: ['./create-list-form.component.scss']
})
export class CreateListFormComponent extends Validation implements OnInit {
  public product!: SummaryProduct;
  public productImage!: string;
  public fromAddToListForm!: boolean
  @Output() onListCreated: EventEmitter<List> = new EventEmitter();

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
  ) { super(dataService, lazyLoadingService) }

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


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataService.post<List>('api/Lists/CreateList',
        {
          name: this.form.get('listName')?.value,
          description: this.form.get('description')?.value
        },
        { authorization: true }
      ).subscribe((list: List) => {
        this.onListCreated.emit(new List(
          list.id,
          this.form.get('listName')?.value,
          this.form.get('description')?.value,
          list.collaborateId,
          this.accountService.user?.profileImage
        ));
        this.close();
      });
    }
  }


  async openAddToListForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
      const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

      return {
        component: AddToListFormComponent,
        module: AddToListFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((addToListForm: AddToListFormComponent) => {
        addToListForm.product = this.product;
        addToListForm.productImage = this.productImage;
      });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }


  close() {
    if (!this.fromAddToListForm) {
      super.close();
    } else {
      this.openAddToListForm();
    }
  }
}