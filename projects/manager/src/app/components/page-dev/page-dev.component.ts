import { Component } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Background, PageComponent, PageContent } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { MenuOptionType } from '../../classes/enums';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { WidgetService } from '../../services/widget/widget.service';
import { ContainerDevComponent } from '../container-dev/container-dev.component';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent implements ContainerHost {
  public host!: ContainerHost;

  constructor(private widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super() }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const container = this.container as ContainerDevComponent;

    container.host = this;
  }

  newPage() {
    this.pageContent = new PageContent();
    this.pageContent.name = 'Untitled';
    this.pageContent.background = new Background();
  }


  onRowChange(maxBottom: number) {
    this.host.onRowChange(maxBottom);
  }


  onMousedown() {
    if (!this.pageContent) return;

    this.widgetService.deselectWidget();
  }
}