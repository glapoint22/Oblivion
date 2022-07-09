import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContent } from 'widgets';

@Component({
  selector: 'custom-page',
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.scss']
})
export class CustomPageComponent implements OnInit {
  public pageContent!: PageContent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageContent = this.route.snapshot.data.pageContent;
  }
}