import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService } from 'common';
import { Page } from 'widgets';
import { SearchResolver } from '../../resolvers/search/search.resolver';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public page!: Page;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private searchResolver: SearchResolver
    ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      if (data.searchData.page) {
        this.page = data.searchData.page;
      } else {
        this.gridWidgetService.gridData.next(data.searchData.gridData);
      }
    });
  }



  ngOnDestroy(): void {
    this.searchResolver.currentSearch = null;
  }
}