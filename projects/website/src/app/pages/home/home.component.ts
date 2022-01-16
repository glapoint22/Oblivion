import { Component, OnInit } from '@angular/core';
import { Page } from '../../classes/page';
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
    this.dataService.get<Page>('api/Home')
      .subscribe((page: Page) => {
        this.page = page;
      });
  }
}