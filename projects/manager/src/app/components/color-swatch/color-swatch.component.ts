import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { Color, LazyLoadingService, SpinnerAction } from 'common';
import { ColorPickerPopupComponent } from '../color-picker-popup/color-picker-popup.component';

@Component({
  selector: 'color-swatch',
  templateUrl: './color-swatch.component.html',
  styleUrls: ['./color-swatch.component.scss']
})
export class ColorSwatchComponent {
  @Input() color!: Color;
  @Input() miniSize!: boolean;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @Output() onColorPickerClose: EventEmitter<void> = new EventEmitter();
  @Output() onColorPickerOpen: EventEmitter<void> = new EventEmitter();
  public colorPickerContainer!: ViewContainerRef;
  public colorPicker!: ColorPickerPopupComponent;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  onSwatchClick(element: HTMLElement) {
    this.loadColorPicker(element);

  }


  async loadColorPicker(element: HTMLElement) {
    if (this.colorPicker) {
      this.colorPicker.close();
      this.colorPicker = null!;
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ColorPickerPopupComponent } = await import('../color-picker-popup/color-picker-popup.component');
      const { ColorPickerPopupModule } = await import('../color-picker-popup/color-picker-popup.module');

      return {
        component: ColorPickerPopupComponent,
        module: ColorPickerPopupModule
      }
    }, SpinnerAction.None, this.colorPickerContainer ? this.colorPickerContainer : null!)
      .then((colorPicker: ColorPickerPopupComponent) => {
        this.colorPicker = colorPicker;
        colorPicker.color = this.color;

        if (this.miniSize) {
          colorPicker.arrowPos = 'bottom';
        } else {
          colorPicker.arrowPos = 'top';
        }

        // Subscribe to every change
        colorPicker.$onChange.subscribe(() => {
          this.onChange.emit();
        });


        // Subscribe to when the color picker opens
        colorPicker.$onOpen.subscribe(() => {
          this.onColorPickerOpen.emit();
        });



        // Subscribe to when the color picker closes
        colorPicker.$onClose.subscribe(() => {
          this.colorPicker = null!;
          this.onColorPickerClose.emit();
        });

        if (!this.colorPickerContainer) {
          const elementRect = element.getBoundingClientRect();

          colorPicker.posX = elementRect.left + 9;
          colorPicker.posY = elementRect.bottom + 5;
        }
      });
  }
}