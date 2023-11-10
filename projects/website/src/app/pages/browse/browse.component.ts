import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService, PageContent } from 'widgets';
import { BrowseResolver } from '../../resolvers/browse/browse.resolver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy {
  public pageContent!: PageContent;
  private routeParentDataSubscription!: Subscription;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private browseResolver: BrowseResolver
    ) { }

  ngOnInit(): void {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(data => {
      if (data.browseData.rows) {
        this.pageContent = data.browseData;
      } else {
        this.gridWidgetService.gridData.next(data.browseData);
      }
    });
  }



  ngOnDestroy(): void {
    this.browseResolver.currentId = null;
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
  }
}
