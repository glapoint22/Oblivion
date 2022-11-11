import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NicheFilter } from '../../classes/niche-filter';
import { NicheFilters } from '../../classes/niche-filters';
import { SubnicheFilter } from '../../classes/subniche-filter';
import { SubnicheFilters } from '../../classes/subniche-filters';

@Component({
  selector: 'niches-filter',
  templateUrl: './niches-filter.component.html',
  styleUrls: ['./niches-filter.component.scss']
})
export class NichesFilterComponent {
  @Input() nicheFilters!: NicheFilters;
  public seeAllNiches!: boolean;
  public pathname!: string;
  public queryParams!: Params;

  constructor(public route: ActivatedRoute) { }


  ngOnInit() {
    this.pathname = document.location.pathname;
  }

  ngOnChanges() {
    if (this.nicheFilters.hidden) {
      this.nicheFilters.hidden.forEach((niche: NicheFilter) => {
        niche.visible = this.seeAllNiches;
      });
    }
  }

  
  onSubnicheClick() {
    this.queryParams = this.route.snapshot.queryParams;
  }
  


  getNicheQueryParams(niche: NicheFilter) {
    return {
      search: this.route.snapshot.queryParams.search,
      nicheName: niche.urlName,
      nicheId: niche.id,
      sort: this.route.snapshot.queryParams.sort,
      filters: this.route.snapshot.queryParams.filters
    }
  }


  getSubnicheQueryParams(subniche: SubnicheFilter) {
    return {
      search: this.route.snapshot.queryParams.search,
      subnicheName: subniche.urlName,
      subnicheId: subniche.id,
      sort: this.route.snapshot.queryParams.sort,
      filters: this.route.snapshot.queryParams.filters
    }
  }


  seeAllFewerSubniches(subniches: SubnicheFilters) {
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
      this.nicheFilters.hidden.forEach(niche => {
        niche.visible = !niche.visible;
      });
    });
  }



  nichesTransitionend(niche: NicheFilter) {
    if (this.nicheFilters.hidden[this.nicheFilters.hidden.length - 1] == niche && !niche.visible) {
      this.seeAllNiches = false;
    }
  }


  subnichesTransitionend(subniche: SubnicheFilter, subniches: SubnicheFilters) {
    if (subniches.hidden[subniches.hidden.length - 1] == subniche && !subniche.visible) {
      subniches.showHidden = false;
    }
  }

  trackNiche(index: number, niche: NicheFilter) {
    return niche.id;
  }


  trackSubniche(index: number, subniche: SubnicheFilter) {
    return subniche.id;
  }
}