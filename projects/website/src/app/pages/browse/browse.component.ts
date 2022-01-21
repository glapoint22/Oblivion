import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../classes/page';
import { BrowseResolver } from '../../resolvers/browse/browse.resolver';
import { GridWidgetService } from '../../services/grid-widget/grid-widget.service';

@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy {
  public page!: Page;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private browseResolver: BrowseResolver
    ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      if (data.browseData.page) {
        this.page = data.browseData.page;
      } else {
        this.gridWidgetService.gridData.next(data.browseData.gridData);
      }
    });
  }



  ngOnDestroy(): void {
    this.browseResolver.currentId = null;
  }
}
