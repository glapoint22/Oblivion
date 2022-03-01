import { Component } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { ButtonWidgetData } from '../../classes/button-widget-data';
import { Caption } from '../../classes/caption';
import { Corners } from '../../classes/corners';
import { Link } from '../../classes/link';
import { Padding } from '../../classes/padding';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';
import { LinkOption } from '../../classes/widget-enums';

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
  public linkOption = LinkOption;
  public background: Background = new Background();
  public border: Border = new Border();
  public padding: Padding = new Padding();

  // Background Hover & Active colors
  private backgroundHoverColor!: string;
  private backgroundActiveColor!: string;

  // Border Hover & Active colors
  private borderHoverColor!: string;
  private borderActiveColor!: string;

  // Text Hover & Active colors
  private textHoverColor!: string;
  private textActiveColor!: string;


  ngOnInit() {
    this.caption.text = 'Button';
    this.background.color = '#808080';
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
    this.backgroundHoverColor = buttonWidgetData.backgroundHoverColor ? buttonWidgetData.backgroundHoverColor : '#969696';
    this.backgroundActiveColor = buttonWidgetData.backgroundActiveColor ? buttonWidgetData.backgroundActiveColor : '#878787';
    this.borderHoverColor = buttonWidgetData.borderHoverColor ? buttonWidgetData.borderHoverColor : '#F0F0F0';
    this.borderActiveColor = buttonWidgetData.borderActiveColor ? buttonWidgetData.borderActiveColor : '#DCDCDC';
    this.textHoverColor = buttonWidgetData.textHoverColor ? buttonWidgetData.textHoverColor : '#FFFFFF';
    this.textActiveColor = buttonWidgetData.textActiveColor ? buttonWidgetData.textActiveColor : '#E1E1E1';


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