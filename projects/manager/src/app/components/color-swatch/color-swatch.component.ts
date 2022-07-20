import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onClick: EventEmitter<void> = new EventEmitter();
  @Output() onColorPickerClose: EventEmitter<void> = new EventEmitter();

  constructor(private lazyLoadingService: LazyLoadingService) { }

  onSwatchClick(element: HTMLElement) {
    this.onClick.emit();
    window.setTimeout(() => this.loadColorPicker(element));

  }


  async loadColorPicker(element: HTMLElement) {
    this.lazyLoadingService.load(async () => {
      const { ColorPickerPopupComponent } = await import('../color-picker-popup/color-picker-popup.component');
      const { ColorPickerPopupModule } = await import('../color-picker-popup/color-picker-popup.module');

      return {
        component: ColorPickerPopupComponent,
        module: ColorPickerPopupModule
      }
    }, SpinnerAction.None)
      .then((colorPicker: ColorPickerPopupComponent) => {
        colorPicker.color = this.color;

        // Subscribe to every change
        colorPicker.$onChange.subscribe(() => {
          this.onChange.emit();
        });


        // Subscribe to when the color picker closes
        colorPicker.$onClose.subscribe(() => {
          this.onColorPickerClose.emit();
        });

        const elementRect = element.getBoundingClientRect();

        colorPicker.posX = elementRect.left;
        colorPicker.posY = elementRect.bottom;
      });
  }
}