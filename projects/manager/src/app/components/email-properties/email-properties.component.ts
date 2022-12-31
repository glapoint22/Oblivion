import { KeyValue } from '@angular/common';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { DropdownType } from 'common';
import { EmailType } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { EmailPageComponent } from '../email-page/email-page.component';

@Component({
  selector: 'email-properties',
  templateUrl: './email-properties.component.html',
  styleUrls: ['./email-properties.component.scss']
})
export class EmailPropertiesComponent implements OnInit {
  public emailTypes: Array<KeyValue<string, number>> = [];
  public DropdownType = DropdownType;

  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { }

  ngOnInit(): void {
    const keys = Object.keys(EmailType);

    for (let i = 0; i < keys.length * 0.5; i++) {

      this.emailTypes.push({
        key: EmailType[i].replace(/([A-Z])/g, ' $1').trim(),
        value: i
      });
    }
  }


  getSelectedEmailType(): KeyValue<string, number> {
    const emailType = (this.widgetService.page as EmailPageComponent).emailType;

    if (emailType) {
      return this.emailTypes.find(x => x.value == emailType)!;
    } else {
      return this.emailTypes[0];
    }
  }


  onEmailTypeChange(emailType: KeyValue<string, number>) {
    (this.widgetService.page as EmailPageComponent).emailType = emailType.value;
    this.widgetService.page.save();
  }



  onBackgroundChange() {
    this.appRef.tick();
    this.widgetService.page.setBackground();
    this.widgetService.page.save();
  }
}
