import { Component, Input } from '@angular/core';
import { Subproduct } from 'common';
import { TextBox, TextBoxData } from 'text-box';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent {
  @Input() components!: Array<Subproduct>;
  @Input() bonuses!: Array<Subproduct>;

  getDescription(rootElement: HTMLElement, description: string) {
    const textBoxData: Array<TextBoxData> = JSON.parse(description);
    const textBox = new TextBox(rootElement);
    
    textBox.load(textBoxData);
    textBox.render();
  }
}