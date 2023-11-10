import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService } from 'common';
import { List } from '../../classes/list';
import { Validation } from '../../classes/validation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edit-list-form',
  templateUrl: './edit-list-form.component.html',
  styleUrls: ['./edit-list-form.component.scss']
})
export class EditListFormComponent extends Validation implements OnInit {
  public list!: List;
  private dataServicePutSubscription!: Subscription;
  @Output() onInit: EventEmitter<void> = new EventEmitter();  

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      listName: new UntypedFormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),
      description: new UntypedFormControl('')
    });
    this.onInit.emit();
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    if (this.form.valid) {

      // Update the list name and description in the database
      this.dataServicePutSubscription = this.dataService.put<List>('api/Lists/EditList', {
        id: this.list.id,
        name: this.form.get('listName')?.value,
        description: this.form.get('description')?.value
      }, { authorization: true }).subscribe(() => {

        // Assign the name and description to the list
        this.list.name = this.form.get('listName')?.value;
        this.list.description = this.form.get('description')?.value;
        this.close();
      });
    }
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServicePutSubscription) this.dataServicePutSubscription.unsubscribe();
  }
}