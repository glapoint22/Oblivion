import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color, LazyLoadingService, SpinnerAction } from 'common';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'color-swatch',
  templateUrl: './color-swatch.component.html',
  styleUrls: ['./color-swatch.component.scss']
})
export class ColorSwatchComponent {
  @Input() color!: Color;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @Output() onClick: EventEmitter<void> = new EventEmitter();
  @Output() onColorPickerClose: EventEmitter<void> = new EventEmitter();

  constructor(private lazyLoadingService: LazyLoadingService) { }

  onSwatchClick() {
    this.onClick.emit();
    this.loadColorPicker();
  }


  async loadColorPicker() {
    this.lazyLoadingService.load(async () => {
      const { ColorPickerComponent } = await import('../color-picker/color-picker.component');
      const { ColorPickerModule } = await import('../color-picker/color-picker.module');

      return {
        component: ColorPickerComponent,
        module: ColorPickerModule
      }
    }, SpinnerAction.None)
      .then((colorPicker: ColorPickerComponent) => {
        colorPicker.color = this.color;

        // Subscribe to every change
        colorPicker.$onChange.subscribe(() => {
          this.onChange.emit();
        });


        // Subscribe to when the color picker closes
        colorPicker.$onClose.subscribe(() => {
          this.onColorPickerClose.emit();
        });
      });
  }
}