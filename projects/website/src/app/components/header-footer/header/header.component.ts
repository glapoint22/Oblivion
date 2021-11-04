import { Component, OnInit } from '@angular/core';
import { LazyLoadingService } from '../../../services/lazy-loading/lazy-loading.service';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: ModalService, private lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
  }


  async onSignUpClick(): Promise<void> {
    const { SignUpFormComponent } = await import('../../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../../sign-up-form/sign-up-form.module');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(SignUpFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }



  async onLoginClick(): Promise<void> {
    const { LogInFormComponent } = await import('../../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../../log-in-form/log-in-form.module');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }

}
