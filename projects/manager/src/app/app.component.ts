import { Component, ViewContainerRef } from '@angular/core';
import { LazyLoadingService } from 'common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private container: ViewContainerRef, public lazyLoadingService: LazyLoadingService) {
    
  }
  

  ngOnInit() {
    this.lazyLoadingService.container = this.container;
  }
}
