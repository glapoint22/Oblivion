import { AfterViewInit, Component } from '@angular/core';
import { Link, LinkType } from 'common';
import { ElementType, TextBox, TextBoxData } from 'text-box';
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

  // ------------------------------------------------------------ Ng On Init -----------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Text;
  }



  // --------------------------------------------------------- Ng After View Init --------------------------------------------------------
  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClasses(this.widgetElement);
    this.setText();
  }



  // ------------------------------------------------------------- Set Widget ----------------------------------------------------------------
  setWidget(textWidgetData: TextWidgetData) {
    this.height = 64;
    this.background.setData(textWidgetData.background);
    this.padding.setData(textWidgetData.padding);

    if (textWidgetData.textBoxData) this.textBoxData = textWidgetData.textBoxData;

    super.setWidget(textWidgetData);
  }





  // ------------------------------------------------------------- Set Text ----------------------------------------------------------------
  setText() {
    this.textBox = new TextBox(this.widgetElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBox.load(this.textBoxData);
      this.textBox.render();
    }
  }


  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): TextWidgetData {
    const textWidgetData = super.getData() as TextWidgetData;

    textWidgetData.background = this.background.getData();
    textWidgetData.padding = this.padding.getData();
    return textWidgetData;
  }
}