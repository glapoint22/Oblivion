import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { Niche } from '../../classes/niche';
import { AccountService } from '../../services/account/account.service';
import { NichesService } from '../../services/niches/niches.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends LazyLoad implements OnInit {
  public niches!: Array<Niche>;

  constructor(private nicheService: NichesService, public accountService: AccountService) { super(); }


  ngOnInit(): void {
    this.nicheService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });
  }
}