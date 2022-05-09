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
  public caption: Caption = new Caption();
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public link: Link = new Link();
  public linkType = LinkType;
  public background: Background = new Background();
  public border: Border = new Border();
  public padding: Padding = new Padding();

  // Background Hover & Active colors
  public backgroundHoverColor: string = '#969696';
  public backgroundActiveColor: string = '#878787';

  // Border Hover & Active colors
  public borderHoverColor: string = '#f0f0f0';
  public borderActiveColor: string = '#dcdcdc';

  // Text Hover & Active colors
  public textHoverColor: string = '#ffffff';
  public textActiveColor: string = '#e1e1e1';


  ngOnInit() {
    this.caption.text = 'Button';
    this.background.color = '#808080';
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
    const buttonStyles = document.createElement('style');
    buttonStyles.appendChild(document.createTextNode(buttonClass));
    document.head.appendChild(buttonStyles);
  }

  setWidget(buttonWidgetData: ButtonWidgetData) {
    this.height = 40;
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
      (this.background.image && this.background.image.url ? '\n\tbackground-image: url("images/' + this.background.image.url + '");' : '') +
      (this.background.image && this.background.image.position ? '\n\tbackground-position: ' + this.background.image.position + ';' : '') +
      (this.background.image && this.background.image.repeat ? '\n\tbackground-repeat: ' + this.background.image.repeat + ';' : '') +
      (this.background.image && this.background.image.attachment ? '\n\tbackground-attachment: ' + this.background.image.attachment + ';' : '') +

      // Border
      (this.border && this.border.enabled ? '\n\tborder: ' + this.border.width + 'px ' + this.border.style + ' ' + this.border.color + ';' : '') +


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
}