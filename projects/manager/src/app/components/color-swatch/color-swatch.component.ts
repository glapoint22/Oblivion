import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Color } from 'widgets';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'color-swatch',
  templateUrl: './color-swatch.component.html',
  styleUrls: ['./color-swatch.component.scss']
})
export class ColorSwatchComponent  {
  @Input() color!: Color;
  @Output() onChange: EventEmitter<void> = new EventEmitter();
  @ViewChild('colorPickerContainer', { read: ViewContainerRef }) colorPickerContainer!: ViewContainerRef;
  
  constructor(private lazyLoadingService: LazyLoadingService) { }

  onClick() {
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
    }, SpinnerAction.None, this.colorPickerContainer)
    .then((colorPicker: ColorPickerComponent)=> {
      colorPicker.color = this.color;
      colorPicker.$onChange.subscribe(()=> {
        this.onChange.emit();
      });
    });
  }

}
