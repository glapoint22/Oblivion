import { ApplicationRef, Component, OnInit } from '@angular/core';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {

  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { }

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

    this.widgetService.$update.subscribe(()=> {
      this.appRef.tick();
    });
  }
}