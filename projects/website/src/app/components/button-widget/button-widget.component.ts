import { Component } from '@angular/core';
import { Background } from '../../classes/background';
import { Border } from '../../classes/border';
import { ButtonWidget } from '../../classes/button-widget';
import { Caption } from '../../classes/caption';
import { Corners } from '../../classes/corners';
import { LinkOption } from '../../classes/enums';
import { Link } from '../../classes/link';
import { Padding } from '../../classes/padding';
import { Shadow } from '../../classes/shadow';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'button-widget',
  templateUrl: './button-widget.component.html',
  styleUrls: ['./button-widget.component.scss']
})
export class ButtonWidgetComponent extends Widget {
  public background!: Background;
  public border!: Border;
  public caption!: Caption;
  public corners!: Corners;
  public shadow!: Shadow;
  public padding!: Padding;
  public link!: Link;
  public linkOption = LinkOption;

  // Background Hover & Active colors
  public backgroundHoverColor!: string;
  public backgroundActiveColor!: string;

  // Border Hover & Active colors
  public borderHoverColor!: string;
  public borderActiveColor!: string;

  // Text Hover & Active colors
  public textHoverColor!: string;
  public textActiveColor!: string;


  

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.addClasses(this.widgetElement, this.breakpoints);

    // Create the button class and add it to the button element
    const buttonClassName = this.createClassName();
    const buttonClass = this.getClass(buttonClassName);
    this.widgetElement.classList.add(buttonClassName);


    // Add the button class to the document
    const buttonStyles = document.createElement('style');
    buttonStyles.appendChild(document.createTextNode(buttonClass));
    document.head.appendChild(buttonStyles);
  }

  setWidget(buttonWidget: ButtonWidget) {
    this.height = 40;
    super.setWidget(buttonWidget);

    this.background = buttonWidget.background;
    this.border = buttonWidget.border;
    this.caption = buttonWidget.caption;
    this.corners = buttonWidget.corners;
    this.shadow = buttonWidget.shadow;
    this.link = buttonWidget.link;
    this.backgroundHoverColor = buttonWidget.backgroundHoverColor;
    this.backgroundActiveColor = buttonWidget.backgroundActiveColor;
    this.borderHoverColor = buttonWidget.borderHoverColor;
    this.borderActiveColor = buttonWidget.borderActiveColor;
    this.textHoverColor = buttonWidget.textHoverColor;
    this.textActiveColor = buttonWidget.textActiveColor;
    this.padding = new Padding(buttonWidget.padding);
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
      (this.border && this.border.enable ? '\n\tborder: ' + this.border.width + 'px ' + this.border.style + ' ' + this.border.color + ';' : '') +


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
        (this.border && this.border.enable && this.borderHoverColor ? '\n\tborder-color: ' + this.borderHoverColor + ';' : '') +
        (this.textHoverColor ? '\n\tcolor: ' + this.textHoverColor + ';' : '') +
        '\n}' : '') +

      // Active
      (this.backgroundActiveColor || this.borderActiveColor || this.textActiveColor ?
        '\n.' + className + ':active {' +
        (this.backgroundHoverColor ? '\n\tbackground-color: ' + this.backgroundActiveColor + ';' : '') +
        (this.borderActiveColor ? '\n\tborder-color: ' + this.borderActiveColor + ';' : '') +
        (this.textActiveColor ? '\n\tcolor: ' + this.textActiveColor + ';' : '') +
        '\n}' : '');
  }
}