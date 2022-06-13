import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadingService, SpinnerAction } from 'common';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService, private lazyLoadingService: LazyLoadingService, private sanitizer: DomSanitizer) { }


  onNewPageClick() {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
    this.widgetService.page.new();
  }


  async onDeletePageClick() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None)
      .then((prompt: PromptComponent) => {
        prompt.title = 'Delete Page';
        prompt.message = this.sanitizer.bypassSecurityTrustHtml(
          'The page <span style="color: #ffba00">\"' + this.widgetService.page.name + '\"</span>' +
          ' will be permanently deleted.');
        prompt.primaryButton.name = 'Delete';
        prompt.primaryButton.buttonFunction = () => {
          this.widgetService.page.delete();
          this.widgetService.currentWidgetInspectorView = WidgetInspectorView.None;
        }
        prompt.secondaryButton.name = 'Cancel';
      });
  }
}