import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContent } from 'widgets';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public pageContent!: PageContent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageContent = this.route.snapshot.data.pageContent;
  }
}