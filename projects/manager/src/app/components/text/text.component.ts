import { ApplicationRef, Component, Input, OnChanges } from '@angular/core';
import { Bold } from '../../classes/bold';
import { Font } from '../../classes/font';
import { Italic } from '../../classes/italic';
import { Text } from '../../classes/text';
import { Underline } from '../../classes/underline';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnChanges {
  @Input() text!: Text;
  public bold!: Bold;
  public italic!: Italic;
  public underline!: Underline;
  public font!: Font;

  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { }

  ngOnChanges(): void {
    if (this.text) {
      this.bold = new Bold(this.text);
      this.italic = new Italic(this.text);
      this.underline = new Underline(this.text);
      this.font = new Font(this.text);


      this.text.onSelection.subscribe(() => {
        this.bold.setSelectedStyle();
        this.italic.setSelectedStyle();
        this.underline.setSelectedStyle();
        this.font.setSelectedStyle();

        this.appRef.tick();
      });
    }
  }
}