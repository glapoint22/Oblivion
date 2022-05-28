import { Component } from '@angular/core';
import { Background, PageComponent, PageContent } from 'widgets';
import { ContainerHost } from '../../classes/container-host';
import { ContainerDevComponent } from '../container-dev/container-dev.component';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent implements ContainerHost {
  public host!: ContainerHost;

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
}