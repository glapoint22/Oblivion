import { ApplicationRef, Component } from '@angular/core';
import { Background, PageComponent, PageContent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent {

  constructor(private widgetService: WidgetService, private appRef: ApplicationRef) { super() }

  ngOnInit() {
    this.widgetService.page = this;

    this.widgetService.$pageChange.subscribe(() => {
      this.setBackground();
      this.appRef.tick();
    });
  }

  newPage() {
    this.pageContent = new PageContent();
    this.pageContent.name = 'Untitled';
    this.pageContent.background = new Background();
    this.widgetService.$pageChange.next();
  }
}