import { ApplicationRef, Component, Input, OnChanges } from '@angular/core';
import { Bold } from '../../classes/bold';
import { FontColor } from '../../classes/font-color';
import { FontFamily } from '../../classes/font-family';
import { FontSize } from '../../classes/font-size';
import { HighlightColor } from '../../classes/highlight-color';
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
  public fontFamily!: FontFamily;
  public fontSize!: FontSize;
  public fontColor!: FontColor;
  public highlightColor!: HighlightColor;

  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { }

  ngOnChanges(): void {
    if (this.text) {
      this.bold = new Bold(this.text);
      this.italic = new Italic(this.text);
      this.underline = new Underline(this.text);
      this.fontFamily = new FontFamily(this.text);
      this.fontSize = new FontSize(this.text);
      this.fontColor = new FontColor(this.text);
      this.highlightColor = new HighlightColor(this.text);


      this.text.onSelection.subscribe(() => {
        this.bold.setSelectedStyle();
        this.italic.setSelectedStyle();
        this.underline.setSelectedStyle();
        this.fontFamily.setSelectedStyle();
        this.fontSize.setSelectedStyle();
        this.fontColor.setSelectedStyle();
        this.highlightColor.setSelectedStyle();

        this.appRef.tick();
      });
    }
  }
}