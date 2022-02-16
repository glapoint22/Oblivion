import { Component, OnInit } from '@angular/core';
import { LazyLoadingService } from 'common';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnInit(): void {
    this.lazyLoadingService.container.clear();
  }
}