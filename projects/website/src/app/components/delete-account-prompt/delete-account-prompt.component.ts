import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { DeleteAccountFormComponent } from '../../components/delete-account-form/delete-account-form.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'delete-account-prompt',
  templateUrl: './delete-account-prompt.component.html',
  styleUrls: ['./delete-account-prompt.component.scss']
})
export class DeleteAccountPromptComponent extends LazyLoad {
  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private spinnerService: SpinnerService) {
    super();
  }

  onDeleteClick() {
    this.spinnerService.show = true;
    this.dataService.post('api/Account/CreateDeleteAccountOTP', {}, {authorization: true})
    .subscribe(() => {
      this.openDeleteAccountForm();
    });
  }


  async openDeleteAccountForm() {
    const { DeleteAccountFormComponent } = await import('../../components/delete-account-form/delete-account-form.component');
    const { DeleteAccountFormModule } = await import('../../components/delete-account-form/delete-account-form.module')

    this.lazyLoadingService.getComponentAsync(DeleteAccountFormComponent, DeleteAccountFormModule, this.lazyLoadingService.container)
      .then((deleteAccountForm: DeleteAccountFormComponent) => {
        this.fade();
        deleteAccountForm.deleteAccountPrompt = this;
        this.spinnerService.show = false;
      });
  }
}