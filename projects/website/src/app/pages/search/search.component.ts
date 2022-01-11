import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GridData } from '../../classes/grid-data';
import { QueryParams } from '../../classes/query-params';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private queryParams: QueryParams = new QueryParams();
  public gridData!: GridData;

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((queryParams: ParamMap) => {
        this.queryParams.set(queryParams);
        this.dataService.post<GridData>('api/Pages/Search', this.queryParams)
          .subscribe((gridData: GridData) => {
            this.gridData = gridData;
          });

      });
  }

}
