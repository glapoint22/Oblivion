import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { Niche } from '../../classes/niche';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { NichesService } from '../../services/niches/niches.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideMenuComponent extends LazyLoad implements OnInit {
  public niches!: Array<Niche>;
  public subNiches: Array<Niche> | undefined;
  public selectedNicheName!: string;

  constructor(
    private nicheService: NichesService,
    public accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private dataService: DataService
  ) { super(); }


  ngOnInit(): void {
    this.nicheService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container);
  }


  async onSignUpLinkClick() {
    this.close();
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container);
  }



  onNicheClick(niche: Niche) {
    this.selectedNicheName = niche.name;

    this.dataService.get<Array<Niche>>('api/Niches', [{key: 'id', value: niche.id}])
      .subscribe((niches: Array<Niche>) => {
        this.subNiches = niches;
      });
  }

}