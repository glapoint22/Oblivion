import { ApplicationRef, Component, Input, OnChanges } from '@angular/core';
import { AlignCenter } from '../../classes/align-center';
import { AlignJustify } from '../../classes/align-justify';
import { AlignLeft } from '../../classes/align-left';
import { AlignRight } from '../../classes/align-right';
import { Bold } from '../../classes/bold';
import { BulletedList } from '../../classes/bulleted-list';
import { DecreaseIndent } from '../../classes/decrease-indent';
import { FontColor } from '../../classes/font-color';
import { FontFamily } from '../../classes/font-family';
import { FontSize } from '../../classes/font-size';
import { HighlightColor } from '../../classes/highlight-color';
import { IncreaseIndent } from '../../classes/increase-indent';
import { Italic } from '../../classes/italic';
import { NumberedList } from '../../classes/numbered-list';
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
  public alignLeft!: AlignLeft;
  public alignCenter!: AlignCenter;
  public alignRight!: AlignRight;
  public alignJustify!: AlignJustify;
  public bulletedList!: BulletedList;
  public numberedList!: NumberedList;
  public increaseIndent!: IncreaseIndent;
  public decreaseIndent!: DecreaseIndent;

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
      this.alignLeft = new AlignLeft(this.text);
      this.alignCenter = new AlignCenter(this.text);
      this.alignRight = new AlignRight(this.text);
      this.alignJustify = new AlignJustify(this.text);
      this.bulletedList = new BulletedList(this.text);
      this.numberedList = new NumberedList(this.text);
      this.increaseIndent = new IncreaseIndent(this.text);
      this.decreaseIndent = new DecreaseIndent(this.text);


      this.text.onSelection.subscribe(() => {
        this.bold.setSelectedStyle();
        this.italic.setSelectedStyle();
        this.underline.setSelectedStyle();
        this.fontFamily.setSelectedStyle();
        this.fontSize.setSelectedStyle();
        this.fontColor.setSelectedStyle();
        this.highlightColor.setSelectedStyle();
        this.alignLeft.setSelectedStyle();
        this.alignCenter.setSelectedStyle();
        this.alignRight.setSelectedStyle();
        this.alignJustify.setSelectedStyle();
        this.bulletedList.setSelectedStyle();
        this.numberedList.setSelectedStyle();

        this.appRef.tick();
      });
    }
  }
}