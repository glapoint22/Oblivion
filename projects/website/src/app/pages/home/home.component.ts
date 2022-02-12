import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'widgets';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public page!: Page;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.page = this.route.snapshot.data.page;
  }
}