import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'success-prompt',
  templateUrl: './success-prompt.component.html',
  styleUrls: ['./success-prompt.component.scss']
})
export class SuccessPromptComponent extends LazyLoad {
  public header!: string;
  public message!: string;
}
