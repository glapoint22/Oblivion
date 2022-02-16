import { Component, OnInit, ViewChild } from '@angular/core';
import { PageContent } from 'widgets';
import { SelectedWidgetIcon } from '../../classes/selected-widget-icon';
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

    _window.widgetService = this.widgetService;

    this.widgetService.$selectedWidgetIcon.subscribe((selectedWidgetIcon: SelectedWidgetIcon) => {
      document.body.style.cursor = selectedWidgetIcon.cursor;
    });
  }
}
