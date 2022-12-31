import { Component, ComponentRef, NgModuleFactory } from '@angular/core';
import { Editor } from '../../classes/editor';
import { BuilderType } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { EmailPageComponent } from '../email-page/email-page.component';
import { EmailPageModule } from '../email-page/email-page.module';

@Component({
  selector: 'email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss']
})
export class EmailEditorComponent extends Editor<EmailPageComponent> {
  public page!: EmailPageComponent;
  public widgetCursors = WidgetCursor.getWidgetCursors(BuilderType.Email);




  // ---------------------------------------- Get Component Ref ----------------------------------------
  public getComponentRef(): ComponentRef<EmailPageComponent> {
    const compFactory = this.resolver.resolveComponentFactory(EmailPageComponent);
    const moduleFactory: NgModuleFactory<EmailPageModule> = this.compiler.compileModuleSync(EmailPageModule);
    const moduleRef = moduleFactory.create(this.injector);
    return this.viewContainerRef.createComponent(compFactory, undefined, moduleRef.injector);
  }




  // ---------------------------------------- Set Page ----------------------------------------
  public setPage(componentRef: ComponentRef<EmailPageComponent>): void {
    this.page = componentRef.instance;
    this.page.host = this;
    this.widgetService.page = this.page;
    this.page.builderType = BuilderType.Email;
    this.page.apiUrl = 'api/Emails';
  }





  public onRowChange(maxBottom: number): void {
    // throw new Error('Method not implemented.');
  }
}