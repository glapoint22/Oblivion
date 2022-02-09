import { Component, OnInit } from '@angular/core';
import { SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { Niche } from '../../classes/niche';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { NichesService } from '../../services/niches/niches.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends LazyLoad implements OnInit {
  public niches!: Array<Niche>;
  public subNiches: Array<Niche> | undefined;
  public selectedNicheName!: string;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private nicheService: NichesService,
      public accountService: AccountService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    this.addEventListeners();
    this.nicheService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });
  }


  async onLogInLinkClick() {
    this.close();

    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async onSignUpLinkClick() {
    this.close();

    this.lazyLoadingService.load(async () => {
      const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
      const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module');

      return {
        component: SignUpFormComponent,
        module: SignUpFormModule
      }
    }, SpinnerAction.StartEnd);
  }



  onNicheClick(niche: Niche) {
    this.selectedNicheName = niche.name;

    this.dataService.get<Array<Niche>>('api/Niches', [{ key: 'id', value: niche.id }])
      .subscribe((niches: Array<Niche>) => {
        this.subNiches = niches;
      });
  }

}