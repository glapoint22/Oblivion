import { Component, OnInit, ViewChild } from '@angular/core';
import { PageContent } from 'widgets';
import { WidgetCursor } from '../../classes/widget-cursor';
import { PageDevComponent } from '../../components/page-dev/page-dev.component';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {
  public pageContent!: PageContent;
  @ViewChild('page') page!: PageDevComponent;

  constructor(private widgetService: WidgetService) { }

  ngOnInit(): void {
    const _window = window as any;

    // Assign widget service to a global variable so it can be accessed outside the iframe
    _window.widgetService = this.widgetService;

    // Subscribe to widget cursor changes
    this.widgetService.$widgetCursor.subscribe((widgetCursor: WidgetCursor) => {
      document.body.style.cursor = widgetCursor.cursor;

      // Assign widget cursor id to body for css
      if (widgetCursor.widgetType) {
        document.body.id = 'widget-cursor';
      } else {
        document.body.id = '';
      }
    });
  }
}