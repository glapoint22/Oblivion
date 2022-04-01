import { Component, Input, OnChanges } from '@angular/core';
import { Bold } from '../../classes/bold';
import { Text } from '../../classes/text';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnChanges {
  @Input() text!: Text;
  // public bold: Style = new Style('font-weight', 'bold');
  // public italic: Style = new Style('font-style', 'italic');
  // public underline: Style = new Style('text-decoration', 'underline');
  public bold!: Bold;

  constructor(public widgetService: WidgetService) { }

  ngOnChanges(): void {
    if (this.text) {
      this.bold = new Bold(this.text);
    }

  }

}
