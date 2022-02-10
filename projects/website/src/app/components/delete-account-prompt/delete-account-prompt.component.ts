import { Component } from '@angular/core';
import { SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'delete-account-prompt',
  templateUrl: './delete-account-prompt.component.html',
  styleUrls: ['./delete-account-prompt.component.scss']
})
export class DeleteAccountPromptComponent extends LazyLoad {
  constructor
    (
      private dataService: DataService,
      lazyLoadingService: LazyLoadingService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onDeleteClick() {
    this.dataService.post('api/Account/CreateDeleteAccountOTP', {}, {
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
}