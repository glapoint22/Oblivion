import { Component } from '@angular/core';
import { Editor } from '../../classes/editor';
import { BuilderType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';

@Component({
  selector: 'email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss']
})
export class EmailEditorComponent extends Editor {
  public widgetCursors = WidgetCursor.getWidgetCursors(BuilderType.Email);



  onLoad(iframe: HTMLIFrameElement): void {
    super.onLoad(iframe);

    this.page.builderType = BuilderType.Email;
  }




  public onRowChange(maxBottom: number): void {
    // throw new Error('Method not implemented.');
  }
}