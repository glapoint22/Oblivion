import { Component, OnInit } from '@angular/core';
import { Page } from '../../classes/page';
import { QueryParams } from '../../classes/query-params';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public page!: Page;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.post<Page>('api/Home', new QueryParams())
      .subscribe((page: Page) => {
        this.page = page;
      });
  }
}