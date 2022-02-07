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
  public product!: Product;
  public fromAddToListForm!: boolean
  @Output() onListCreated: EventEmitter<List> = new EventEmitter();

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private accountService: AccountService,
      private spinnerService: SpinnerService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      listName: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
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
        this.onListCreated.emit(new List(
          list.id,
          this.form.get('listName')?.value,
          this.form.get('description')?.value,
          list.collaborateId,
          this.accountService.customer?.profileImage
        ));
        this.close();
      });
    }
  }


  async openAddToListForm() {
    this.fade();
    this.spinnerService.show = true;
    const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
    const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

    this.lazyLoadingService.getComponentAsync(AddToListFormComponent, AddToListFormModule, this.lazyLoadingService.container)
      .then((addToListForm: AddToListFormComponent) => {
        addToListForm.product = this.product;
      });
  }


  close() {
    if (!this.fromAddToListForm) {
      super.close();
    } else {
      this.openAddToListForm();
    }
  }
}