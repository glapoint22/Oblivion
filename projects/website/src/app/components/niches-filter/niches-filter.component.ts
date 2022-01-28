import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NicheFilter } from '../../classes/niche-filter';
import { NichesFilter } from '../../classes/niches-filter';
import { SubnicheFilter } from '../../classes/subniche-filter';
import { SubnichesFilter } from '../../classes/subniches-filter';

@Component({
  selector: 'niches-filter',
  templateUrl: './niches-filter.component.html',
  styleUrls: ['./niches-filter.component.scss']
})
export class NichesFilterComponent {
  @Input() niches!: NichesFilter;
  public seeAllNiches!: boolean;
  public pathname!: string;

  constructor(public route: ActivatedRoute) { }

  

  ngOnInit() {
    this.pathname = document.location.pathname;
  }

  ngOnChanges() {
    if (this.niches.hidden) {
      this.niches.hidden.forEach((niche: NicheFilter) => {
        niche.visible = this.seeAllNiches;
      });
    }
  }


  getNicheQueryParams(niche: NicheFilter) {
    return {
      search: this.route.snapshot.queryParams.search,
      categoryName: niche.urlName,
      categoryId: niche.urlId,
      sort: this.route.snapshot.queryParams.sort
    }
  }


  getSubnicheQueryParams(subniche: SubnicheFilter) {
    return {
      search: this.route.snapshot.queryParams.search,
      nicheName: subniche.urlName,
      nicheId: subniche.urlId,
      sort: this.route.snapshot.queryParams.sort
    }
  }


  seeAllFewerSubniches(subniches: SubnichesFilter) {
    if (!subniches.showHidden) subniches.showHidden = true;

    window.setTimeout(() => {
      subniches.hidden.forEach(subniche => {
        subniche.visible = !subniche.visible;
      });
    });
  }


  seeAllFewerNiches() {
    if (!this.seeAllNiches) this.seeAllNiches = true;

    window.setTimeout(() => {
      this.niches.hidden.forEach(niche => {
        niche.visible = !niche.visible;
      });
    });
  }



  nichesTransitionend(niche: NicheFilter) {
    if (this.niches.hidden[this.niches.hidden.length - 1] == niche && !niche.visible) {
      this.seeAllNiches = false;
    }
  }


  subnichesTransitionend(subniche: SubnicheFilter, subniches: SubnichesFilter) {
    if (subniches.hidden[subniches.hidden.length - 1] == subniche && !subniche.visible) {
      subniches.showHidden = false;
    }
  }

  trackNiche(index: number, niche: NicheFilter) {
    return niche.urlId;
  }


  trackSubniche(index: number, subniche: SubnicheFilter) {
    return subniche.urlId;
  }
}