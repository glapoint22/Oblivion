import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService } from 'common';
import { Page } from 'widgets';
import { BrowseResolver } from '../../resolvers/browse/browse.resolver';

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
