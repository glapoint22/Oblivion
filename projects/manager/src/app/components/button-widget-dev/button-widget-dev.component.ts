import { Component } from '@angular/core';
import { Color } from 'common';
import { ButtonWidgetComponent, VerticalAlignmentType, VerticalAlignmentValue } from 'widgets';
import { ButtonState } from '../../classes/enums';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'button-widget-dev',
  templateUrl: './button-widget-dev.component.html',
  styleUrls: ['./button-widget-dev.component.scss']
})
export class ButtonWidgetDevComponent extends ButtonWidgetComponent {
  public currentState: ButtonState = ButtonState.Normal;

  // Background Hover Color
  private _backgroundHoverColorDev: Color = Color.hexToRGB(this.backgroundHoverColor);
  public get backgroundHoverColorDev(): Color {
    return this._backgroundHoverColorDev;
  }
  public set backgroundHoverColorDev(color: Color) {
    this.backgroundHoverColor = color.toRGBString();
    this._backgroundHoverColorDev = color;
  }


  // Background Active Color
  private _backgroundActiveColorDev: Color = Color.hexToRGB(this.backgroundActiveColor);
  public get backgroundActiveColorDev(): Color {
    return this._backgroundActiveColorDev;
  }
  public set backgroundActiveColorDev(color: Color) {
    this.backgroundActiveColor = color.toRGBString();
    this._backgroundActiveColorDev = color;
  }



  // Border Hover Color
  private _borderHoverColorDev: Color = Color.hexToRGB(this.borderHoverColor);
  public get borderHoverColorDev(): Color {
    return this._borderHoverColorDev;
  }
  public set borderHoverColorDev(color: Color) {
    this.borderHoverColor = color.toRGBString();
    this._borderHoverColorDev = color;
  }


  // Border Active Color
  private _borderActiveColorDev: Color = Color.hexToRGB(this.borderActiveColor);
  public get borderActiveColorDev(): Color {
    return this._borderActiveColorDev;
  }
  public set borderActiveColorDev(color: Color) {
    this.borderActiveColor = color.toRGBString();
    this._borderActiveColorDev = color;
  }




  // Text Hover Color
  private _textHoverColorDev: Color = Color.hexToRGB(this.textHoverColor);
  public get textHoverColorDev(): Color {
    return this._textHoverColorDev;
  }
  public set textHoverColorDev(color: Color) {
    this.textHoverColor = color.toRGBString();
    this._textHoverColorDev = color;
  }


  // Text Active Color
  private _textActiveColorDev: Color = Color.hexToRGB(this.textActiveColor);
  public get textActiveColorDev(): Color {
    return this._textActiveColorDev;
  }
  public set textActiveColorDev(color: Color) {
    this.textActiveColor = color.toRGBString();
    this._textActiveColorDev = color;
  }


  constructor(public widgetService: WidgetService, private breakpointService: BreakpointService) { super() }

  ngOnInit() {
    super.ngOnInit();
    this.background.enabled = true;
  }


  // ------------------------------------------------------------ Add Buton Class To Document ----------------------------------------------------------
  addButonClassToDocument(buttonClass: string) {
    const document = this.widgetElement.getRootNode() as Document;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(buttonClass));
    document.head.appendChild(style);
  }


  // ------------------------------------------------------------ Get Background Color ----------------------------------------------------------
  getBackgroundColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.background.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.backgroundHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.backgroundActiveColorDev.toRGBString();
        break;
    }

    return color;
  }





  // --------------------------------------------------------------- Get Border Color ----------------------------------------------------------
  getBorderColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.border.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.borderHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.borderActiveColorDev.toRGBString();
        break;
    }

    return color;
  }




  // ----------------------------------------------------------------- Get Text Color -----------------------------------------------------------
  getTextColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.caption.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.textHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.textActiveColorDev.toRGBString();
        break;
    }

    return color;
  }



  onBottomHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetElement.getRootNode() as Document;
    const row = this.widgetService.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint as string));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = this.height;
      let delta = mousemoveEvent.movementY;

      // Set the new height
      this.height += delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);

      // Make sure the new height does NOT go below the min height
      if (this.height < minHeight) {
        this.height = minHeight;
        delta = (this.height - previousHeight) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
      }

      // Vertical alignment is set to middle
      if (verticalAlignmentType == VerticalAlignmentType.Middle) {

        // Adjust the row's position
        if (this.height > rowHeight) {
          row.top -= delta - Math.max(0, rowHeight - previousHeight) * 0.5;
          row.rowElement.style.top = row.top + 'px';
        } else {
          if (previousHeight > rowHeight) {
            row.top += (previousHeight - rowHeight) * 0.5;
            row.rowElement.style.top = row.top + 'px';
          }
        }
      } else

        // Vertical alignment is set to bottom
        if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
          // Adjust the row's position
          if (this.height < rowHeight) {
            if (previousHeight > rowHeight) {
              row.top += this.height - rowHeight;
            } else {
              row.top += delta;
            }

            row.rowElement.style.top = row.top + 'px';
          } else {
            if (previousHeight < rowHeight) {
              row.top -= previousHeight - rowHeight;
              row.rowElement.style.top = row.top + 'px';
            }
          }
        }

      this.widgetElement.style.minHeight = this.height + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }








  onTopHandleMousedown(mousedownEvent: MouseEvent) {
    const document = this.widgetElement.getRootNode() as Document;
    const row = this.widgetService.selectedRow;
    const breakpoint = this.breakpointService.getBreakpoint(row.verticalAlignment.values.map(x => x.breakpoint as string));
    const verticalAlignmentValue = row.verticalAlignment.values.find(x => breakpoint ? x.breakpoint == breakpoint : !x.breakpoint)!;
    const verticalAlignmentType = verticalAlignmentValue ? verticalAlignmentValue.verticalAlignmentType : VerticalAlignmentType.Top;
    const rowHeight = this.getRowHeight();
    const minHeight = this.getMinHeight();


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      const previousHeight = this.height;
      let delta = mousemoveEvent.movementY;

      // Set the new height
      this.height -= delta * (verticalAlignmentType == VerticalAlignmentType.Middle ? 2 : 1);


      // Make sure the new height does NOT go below the min height
      if (this.height < minHeight) {
        this.height = minHeight;
        delta = (previousHeight - this.height) * (verticalAlignmentType == VerticalAlignmentType.Middle ? 0.5 : 1);
      }


      // Vertical alignment is set to top
      if (verticalAlignmentType == VerticalAlignmentType.Top) {
        row.top += delta;
        row.rowElement.style.top = row.top + 'px';
      } else
        // Vertical alignment is set to middle
        if (verticalAlignmentType == VerticalAlignmentType.Middle) {

          // Adjust the row's position
          if (this.height > rowHeight) {
            row.top += delta + Math.max(0, rowHeight - previousHeight) * 0.5;
            row.rowElement.style.top = row.top + 'px';
          } else {
            if (previousHeight > rowHeight) {
              row.top += (previousHeight - rowHeight) * 0.5;
              row.rowElement.style.top = row.top + 'px';
            }
          }
        } else
          // Vertical alignment is set to bottom
          if (verticalAlignmentType == VerticalAlignmentType.Bottom) {
            // Adjust the row's position
            if (this.height < rowHeight) {
              if (previousHeight > rowHeight) {
                row.top += previousHeight - rowHeight;
              }

              row.rowElement.style.top = row.top + 'px';
            } else {

              if (previousHeight < rowHeight) {
                row.top -= this.height - rowHeight;
                row.rowElement.style.top = row.top + 'px';
              } else {
                row.top += delta;
                row.rowElement.style.top = row.top + 'px';
              }
            }
          }


      this.widgetElement.style.minHeight = this.height + 'px';
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup, { once: true });
    mousedownEvent.stopPropagation();
  }















  private getRowHeight(): number {
    let rowHeight = 0;

    const columnHeights = this.widgetService.selectedRow.columns
      .filter(x => x != this.widgetService.selectedColumn)
      .map(x => x.columnElement.getBoundingClientRect().height);

    if (columnHeights.length > 0) rowHeight = columnHeights.reduce((a, b) => Math.max(a, b));

    return rowHeight;
  }



  getMinHeight(): number {
    const children: Array<Element> = Array.from(this.widgetElement.children).filter(x => x.id != 'handles');
    return Math.max(...children.map((x: any) => x.offsetHeight)) + 2 // The plus 2 is for the border
  }

}
