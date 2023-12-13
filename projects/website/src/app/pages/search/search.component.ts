import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GridWidgetService, PageContent } from 'widgets';
import { SearchResolver } from '../../resolvers/search/search.resolver';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public pageContent!: PageContent;
  private routeParentDataSubscription!: Subscription;
  private routeQueryParamMapSubscription!: Subscription;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private searchResolver: SearchResolver,
      private socialMediaService: SocialMediaService
    ) { }

  ngOnInit(): void {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(data => {
      if (data.pageContent.rows) {
        this.pageContent = data.pageContent;
      } else {
        this.gridWidgetService.gridData.next(data.pageContent);
      }
    });

    this.routeQueryParamMapSubscription = this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      this.socialMediaService.addMetaTags(queryParams.get('search') as string);
    });
  }

  ngOnDestroy(): void {
    this.searchResolver.currentSearch = null;
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
    if (this.routeQueryParamMapSubscription) this.routeQueryParamMapSubscription.unsubscribe();
  }
}