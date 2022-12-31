import { Component } from '@angular/core';
import { PageContent } from 'widgets';
import { EmailType, WidgetInspectorView } from '../../classes/enums';
import { PageData } from '../../classes/page-data';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  selector: 'email-page',
  templateUrl: './email-page.component.html',
  styleUrls: ['./email-page.component.scss']
})
export class EmailPageComponent extends PageDevComponent {
  public emailType!: EmailType;

  // -------------------------------------------------------------------------------- New -------------------------------------------------------------------
  public new(): void {
    this.clear();
    this.name = 'New email';
    this.emailType = EmailType.None;
    this.pageContent = new PageContent();
    this.pageContent.background.enabled = true;
    this.pageContent.background.color = '#ffffff';
    this.setBackground();
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;

    this.dataService.post<string>('api/Emails', {
      name: this.name,
      content: this.widgetService.stringify(this.pageContent)
    }, {
      authorization: true
    }).subscribe((id: string) => {
      this.id = id;
    });
  }



  // ----------------------------------------------------------------------------- Set Data --------------------------------------------------------------
  public setData(pageData: PageData): void {
    this.emailType = pageData.emailType;
    super.setData(pageData);
  }



  // --------------------------------------------------------------------------- Update Page -----------------------------------------------------------
  public updatePage(){
    this.dataService.put('api/Emails', {
      id: this.id,
      type: this.emailType,
      name: this.name,
      content: this.widgetService.stringify(this.pageContent)
    }, {
      authorization: true
    }).subscribe();
  }




  SetDeletePrompt(prompt: PromptComponent) {
    prompt.title = 'Delete Email';
    prompt.message = this.sanitizer.bypassSecurityTrustHtml(
      'The email, <span style="color: #ffba00">\"' + this.name + '\"</span>' +
      ', will be permanently deleted.');
  }
}