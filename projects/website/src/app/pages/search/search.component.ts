import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService, PageContent } from 'widgets';
import { SearchResolver } from '../../resolvers/search/search.resolver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public pageContent!: PageContent;
  private routeParentDataSubscription!: Subscription;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private searchResolver: SearchResolver
    ) { }

  ngOnInit(): void {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(data => {
      if (data.pageContent.rows) {
        this.pageContent = data.pageContent;
      } else {
        this.gridWidgetService.gridData.next(data.pageContent);
      }
    });
  }

  ngOnDestroy(): void {
    this.searchResolver.currentSearch = null;
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
  }
}