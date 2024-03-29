import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'delete-account-prompt',
  templateUrl: './delete-account-prompt.component.html',
  styleUrls: ['./delete-account-prompt.component.scss']
})
export class DeleteAccountPromptComponent extends LazyLoad {
  private dataServiceGetSubscription!: Subscription;

  constructor
    (
      private dataService: DataService,
      lazyLoadingService: LazyLoadingService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
  }


  onDeleteClick() {
    this.dataServiceGetSubscription = this.dataService.get('api/Account/CreateDeleteAccountOTP', [], {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    })
      .subscribe(() => {
        this.openDeleteAccountForm();
      });
  }


  async openDeleteAccountForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { DeleteAccountFormComponent } = await import('../../components/delete-account-form/delete-account-form.component');
      const { DeleteAccountFormModule } = await import('../../components/delete-account-form/delete-account-form.module');

      return {
        component: DeleteAccountFormComponent,
        module: DeleteAccountFormModule
      }
    }, SpinnerAction.End);
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServiceGetSubscription) this.dataServiceGetSubscription.unsubscribe();
  }
}