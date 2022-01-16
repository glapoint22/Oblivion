import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Page } from '../../classes/page';
import { QueryParams } from '../../classes/query-params';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  public page!: Page;
  private currentId!: string;


  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params: ParamMap) => {
        const id = params.has('nicheId') ? params.get('nicheId') : params.get('categoryId');

        if (id && id != this.currentId) {
          this.currentId = id;

          const queryParams = new QueryParams();
          queryParams.set(params);

          this.dataService.post<Page>('api/Pages/Browse', queryParams)
            .subscribe((page: Page) => {
              if(!page) {
                this.router.navigate(['**'], { skipLocationChange: true });
              } else {
                this.page = page;
              }
              
            });
        } else {
          if (!id) this.router.navigate(['**'], { skipLocationChange: true });
        }
      });
  }
}
