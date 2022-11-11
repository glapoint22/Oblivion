import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService, PageContent } from 'widgets';
import { SearchResolver } from '../../resolvers/search/search.resolver';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public pageContent!: PageContent;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private searchResolver: SearchResolver
    ) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      if (data.pageContent.rows) {
        this.pageContent = data.pageContent;
      } else {
        this.gridWidgetService.gridData.next(data.pageContent);
      }
    });
  }

  ngOnDestroy(): void {
    this.searchResolver.currentSearch = null;
  }
}