import { Component } from '@angular/core';
import { Link, LinkType } from 'common';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { ButtonWidgetData } from '../../classes/button-widget-data';
import { Caption } from '../../classes/caption';
import { Corners } from '../../classes/corners';
import { Padding } from '../../classes/padding';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'button-widget',
  templateUrl: './button-widget.component.html',
  styleUrls: ['./button-widget.component.scss']
})
export class ButtonWidgetComponent extends Widget {
  // Defaults
  private defaultBackground = '#808080';
  private defaultBackgroundHoverColor = '#969696';
  private defaultBackgroundActiveColor = '#878787';
  private defaultBorderHoverColor = '#f0f0f0';
  private defaultBorderActiveColor = '#dcdcdc';
  private defaultTextHoverColor = '#ffffff';
  private defaultTextActiveColor = '#e1e1e1';


  public caption: Caption = new Caption();
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public link: Link = new Link();
  public linkType = LinkType;
  public background: Background = new Background(this.defaultBackground);
  public border: Border = new Border();
  public padding: Padding = new Padding();

  // Background Hover & Active colors
  public backgroundHoverColor: string = this.defaultBackgroundHoverColor;
  public backgroundActiveColor: string = this.defaultBackgroundActiveColor;

  // Border Hover & Active colors
  public borderHoverColor: string = this.defaultBorderHoverColor;
  public borderActiveColor: string = this.defaultBorderActiveColor;

  // Text Hover & Active colors
  public textHoverColor: string = this.defaultTextHoverColor;
  public textActiveColor: string = this.defaultTextActiveColor;


  ngOnInit() {
    this.type = WidgetType.Button;
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClasses(this.widgetElement);

    // Create the button class and add it to the button element
    const buttonClassName = this.createClassName();
    const buttonClass = this.getClass(buttonClassName);
    this.widgetElement.classList.add(buttonClassName);


    // Add the button class to the document
    this.addButonClassToDocument(buttonClass);
  }


  addButonClassToDocument(buttonClass: string) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(buttonClass));
    document.head.appendChild(style);
  }


  setWidget(buttonWidgetData: ButtonWidgetData) {
    this.height = 40;
    this.caption.text = 'Button';
    this.background.setData(buttonWidgetData.background);
    this.border.setData(buttonWidgetData.border);
    this.caption.setData(buttonWidgetData.caption);
    this.corners.setData(buttonWidgetData.corners);
    this.shadow.setData(buttonWidgetData.shadow);
    this.link.setData(buttonWidgetData.link);
    this.padding.setData(buttonWidgetData.padding);
    this.backgroundHoverColor = buttonWidgetData.backgroundHoverColor ? buttonWidgetData.backgroundHoverColor : this.backgroundHoverColor;
    this.backgroundActiveColor = buttonWidgetData.backgroundActiveColor ? buttonWidgetData.backgroundActiveColor : this.backgroundActiveColor;
    this.borderHoverColor = buttonWidgetData.borderHoverColor ? buttonWidgetData.borderHoverColor : this.borderHoverColor;
    this.borderActiveColor = buttonWidgetData.borderActiveColor ? buttonWidgetData.borderActiveColor : this.borderActiveColor;
    this.textHoverColor = buttonWidgetData.textHoverColor ? buttonWidgetData.textHoverColor : this.textHoverColor;
    this.textActiveColor = buttonWidgetData.textActiveColor ? buttonWidgetData.textActiveColor : this.textActiveColor;


    super.setWidget(buttonWidgetData);
  }



  // ------------------------------------------------------------ Create Class Name -----------------------------------------------------------
  createClassName() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }



  // ------------------------------------------------------------ Get Class -----------------------------------------------------------
  getClass(className: string): string {
    return '.' + className + ' {' +

      // Background
      '\n\tbackground-color: ' + this.background.color + ';' +
      (this.background.image && this.background.image.src ? '\n\tbackground-image: url("images/' + this.background.image.src + '");' : '') +
      (this.background.image && this.background.image.position ? '\n\tbackground-position: ' + this.background.image.position + ';' : '') +
      (this.background.image && this.background.image.repeat ? '\n\tbackground-repeat: ' + this.background.image.repeat + ';' : '') +
      (this.background.image && this.background.image.attachment ? '\n\tbackground-attachment: ' + this.background.image.attachment + ';' : '') +

      // Border
      (this.border && this.border.enabled ? '\n\toutline: ' + this.border.width + 'px ' + this.border.style + ' ' + this.border.color + ';' : '') +


      // Caption
      (this.caption.fontWeight ? '\n\tfont-weight: ' + this.caption.fontWeight + ';' : '') +
      (this.caption.fontStyle ? '\n\tfont-style: ' + this.caption.fontStyle + ';' : '') +
      (this.caption.textDecoration ? '\n\ttext-decoration: ' + this.caption.textDecoration + ';' : '') +
      '\n\tcolor: ' + this.caption.color + ';' +

      // Height
      '\n\tmin-height: ' + this.height + 'px;' +

      // Width
      (this.width ? '\n\tmax-width: ' + this.width + 'px;' : '') + '\n}' +



      // Hover
      (this.backgroundHoverColor || this.borderHoverColor || this.textHoverColor ?
        '\n.' + className + ':hover {' +
        (this.backgroundHoverColor ? '\n\tbackground-color: ' + this.backgroundHoverColor + ';' : '') +
        (this.border && this.border.enabled && this.borderHoverColor ? '\n\tborder-color: ' + this.borderHoverColor + ';' : '') +
        (this.textHoverColor ? '\n\tcolor: ' + this.textHoverColor + ';' : '') +
        '\n}' : '') +

      // Active
      (this.backgroundActiveColor || this.borderActiveColor || this.textActiveColor ?
        '\n.' + className + ':active {' +
        (this.backgroundHoverColor ? '\n\tbackground-color: ' + this.backgroundActiveColor + ';' : '') +
        (this.border && this.border.enabled && this.borderActiveColor ? '\n\tborder-color: ' + this.borderActiveColor + ';' : '') +
        (this.textActiveColor ? '\n\tcolor: ' + this.textActiveColor + ';' : '') +
        '\n}' : '');
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ButtonWidgetData {
    const buttonWidgetData = super.getData() as ButtonWidgetData;

    buttonWidgetData.background = this.background.color != this.defaultBackground || this.background.image.src != null ? this.background.getData() : null!;
    buttonWidgetData.border = this.border.getData();
    buttonWidgetData.caption = this.caption.getData();
    buttonWidgetData.corners = this.corners.getData();
    buttonWidgetData.shadow = this.shadow.getData();
    buttonWidgetData.padding = this.padding.getData();
    buttonWidgetData.link = this.link.getData();
    buttonWidgetData.backgroundHoverColor = this.backgroundHoverColor != this.defaultBackgroundHoverColor ? this.backgroundHoverColor : null!;
    buttonWidgetData.backgroundActiveColor = this.backgroundActiveColor != this.defaultBackgroundActiveColor ? this.backgroundActiveColor : null!;
    buttonWidgetData.borderHoverColor = this.borderHoverColor != this.defaultBorderHoverColor ? this.borderHoverColor : null!;
    buttonWidgetData.borderActiveColor = this.borderActiveColor != this.defaultBorderActiveColor ? this.borderActiveColor : null!;
    buttonWidgetData.textHoverColor = this.textHoverColor != this.defaultTextHoverColor ? this.textHoverColor : null!;
    buttonWidgetData.textActiveColor = this.textActiveColor != this.defaultTextActiveColor ? this.textActiveColor : null!;

    return buttonWidgetData;
  }
}