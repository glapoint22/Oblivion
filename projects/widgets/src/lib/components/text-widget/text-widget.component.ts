import { AfterViewInit, Component } from '@angular/core';
import { TextBox, TextBoxData } from 'text-box';
import { Background } from '../../classes/background';
import { Padding } from '../../classes/padding';
import { TextWidgetData } from '../../classes/text-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent extends Widget implements AfterViewInit {
  public background: Background = new Background();
  public padding: Padding = new Padding();
  public textBoxData: Array<TextBoxData> = [];
  private textBox!: TextBox;

  ngOnInit() {
    this.type = WidgetType.Text;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClasses(this.widgetElement);
    this.setText();
  }

  setWidget(textWidgetData: TextWidgetData) {
    this.background.setData(textWidgetData.background);
    this.padding.setData(textWidgetData.padding);

    if (textWidgetData.textData) this.textBoxData = textWidgetData.textData;

    super.setWidget(textWidgetData);
  }

  setText() {
    this.textBox = new TextBox(this.widgetElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBox.load(this.textBoxData);
      this.textBox.render();
    }
  }
}