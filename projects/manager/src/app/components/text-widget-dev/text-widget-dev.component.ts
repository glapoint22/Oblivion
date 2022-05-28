import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextBoxDev } from 'text-box';
import { TextWidgetComponent } from 'widgets';
import { WidgetHandle } from '../../classes/enums';
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

  constructor(public widgetService: WidgetService) { super() }

  ngOnInit(): void {
    super.ngOnInit();
    this.height = 64;
  }

  setText() {
    this.textBoxDev = new TextBoxDev(this.htmlRootElement.nativeElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBoxDev.load(this.textBoxData);
    }

    this.textBoxDev.render();
  }


  ngAfterViewChecked() {
    if (this.widgetService.selectedWidget != this) {
      this.inEditMode = false;
    }
  }
}