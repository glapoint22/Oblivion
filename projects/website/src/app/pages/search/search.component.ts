import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Page } from '../../classes/page';
import { QueryParams } from '../../classes/query-params';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public page!: Page;
  private currentSearch!: string;

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const search = params.get('search');

      if (search && search != this.currentSearch) {
        this.currentSearch = search;

        const queryParams = new QueryParams();
        queryParams.set(params);
          
        this.dataService.post<Page>('api/Pages/Search', queryParams)
          .subscribe((page: Page) => {
            this.page = page;
          });
      }
    });
  }
}