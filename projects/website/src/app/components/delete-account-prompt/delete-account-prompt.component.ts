import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'delete-account-prompt',
  templateUrl: './delete-account-prompt.component.html',
  styleUrls: ['./delete-account-prompt.component.scss']
})
export class DeleteAccountPromptComponent extends LazyLoad {

  constructor(private lazyLoadingService: LazyLoadingService) {
    super();
  }


  async onDeleteClick() {
    this.close();
    const { DeleteAccountFormComponent } = await import('../../components/delete-account-form/delete-account-form.component');
    const { DeleteAccountFormModule } = await import('../../components/delete-account-form/delete-account-form.module')

    this.lazyLoadingService.getComponentAsync(DeleteAccountFormComponent, DeleteAccountFormModule, this.lazyLoadingService.container);
  }

}
