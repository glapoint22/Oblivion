import { Component } from '@angular/core';
import { LogInFormComponent } from '../../components/log-in-form/log-in-form.component';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends LogInFormComponent { }