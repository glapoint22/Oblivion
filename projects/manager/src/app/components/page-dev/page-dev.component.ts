import { Component, ViewChild } from '@angular/core';
import { Background, PageComponent, PageContent } from 'widgets';
import { WidgetCursor } from '../../classes/widget-cursor';
import { ContainerDevComponent } from '../container-dev/container-dev.component';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent {
  @ViewChild('container') container!: ContainerDevComponent;
  public widgetCursor!: WidgetCursor;

  ngAfterViewInit(): void {
    this.container.page = this;

    super.ngAfterViewInit();
  }

  newPage() {
    this.pageContent = new PageContent();
    this.pageContent.name = 'Untitled';
    this.pageContent.background = new Background();
  }
}