import { Component } from '@angular/core';
import { LogInFormComponent } from '../../components/log-in-form/log-in-form.component';
import { AccountService, DataService, LazyLoadingService } from 'common';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends LogInFormComponent {

  constructor(dataService: DataService,
    lazyLoadingService: LazyLoadingService,
    accountService: AccountService,
    private socialMediaService: SocialMediaService) {
    super(dataService, lazyLoadingService, accountService);
  }

  ngOnInit(): void {
    this.setForm();

    this.socialMediaService.addMetaTags('Log In');
  }

  ngAfterViewInit(): void { }
}