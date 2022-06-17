import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextBoxDev } from 'text-box';
import { TextWidgetComponent, TextWidgetData } from 'widgets';
import { WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text-widget-dev',
  templateUrl: './text-widget-dev.component.html',
  styleUrls: ['./text-widget-dev.component.scss']
})
export class TextWidgetDevComponent extends TextWidgetComponent implements OnInit {
  @ViewChild('htmlRootElement') htmlRootElement!: ElementRef<HTMLElement>;
  public textBoxDev!: TextBoxDev;
  public widgetHandle = WidgetHandle;
  public inEditMode!: boolean;
  public widgetInspectorView = WidgetInspectorView;
  public widgetHandleDown!: boolean;

  constructor(public widgetService: WidgetService) { super() }


  ngOnInit(): void {
    super.ngOnInit();

    this.widgetService.widgetDocument.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.inEditMode && !this.widgetHandleDown) event.stopImmediatePropagation();
    });
  }


  onWidgetHandleDown() {
    this.widgetHandleDown = true;
    this.widgetService.widgetDocument.addEventListener('mouseup', () => {
      this.widgetHandleDown = false;
    }, { once: true });
  }


  setText() {
    this.textBoxDev = new TextBoxDev(this.htmlRootElement.nativeElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBoxDev.load(this.textBoxData);
    }

    this.textBoxDev.render();
  }

  




  ngDoCheck() {
    if (this.widgetService.selectedWidget != this) {
      this.inEditMode = false;
    }
  }


  getData(): TextWidgetData {
    const textWidgetData = super.getData() as TextWidgetData;

    textWidgetData.textBoxData = this.textBoxDev.getData();
    return textWidgetData;
  }
}