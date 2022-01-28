import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'report-item-form',
  templateUrl: './report-item-form.component.html',
  styleUrls: ['./report-item-form.component.scss']
})
export class ReportItemFormComponent extends LazyLoad {
  public isFromRedirect!: boolean;
  public productId!: number;
  public comments!: string;
  public type: number = 2;
  public logInForm!: LogInFormComponent | null;
  public listItems = [
    {
      key: 'Product Name',
      value: [
        {
          key: 'Doesn\'t match with product description',
          value: 2
        },
        {
          key: 'Doesn\'t match with product image',
          value: 3
        },
        {
          key: 'Other',
          value: 4
        }
      ]
    },
    {
      key: 'Price',
      value: [
        {
          key: 'Too high',
          value: 5
        },
        {
          key: 'Not correct',
          value: 6
        },
        {
          key: 'Other',
          value: 7
        }
      ]
    },
    {
      key: 'Videos & Images',
      value: [
        {
          key: 'Different from product',
          value: 8
        },
        {
          key: 'Not enough',
          value: 9
        },
        {
          key: 'Not clear',
          value: 10
        },
        {
          key: 'Misleading',
          value: 11
        },
        {
          key: 'Other',
          value: 12
        }
      ]
    },
    {
      key: 'Product Description',
      value: [
        {
          key: 'Incorrect description',
          value: 13
        },
        {
          key: 'Too vague',
          value: 14
        },
        {
          key: 'Misleading',
          value: 15
        },
        {
          key: 'Other',
          value: 16
        }
      ]
    },
    {
      key: 'Offensive Product',
      value: [
        {
          key: 'Illegal product',
          value: 17
        },
        {
          key: 'Adult content',
          value: 18
        },
        {
          key: 'Other',
          value: 19
        }
      ]
    },
    {
      key: 'Missing Product',
      value: [
        {
          key: 'Inactive product',
          value: 20
        },
        {
          key: 'Product site is no longer in service',
          value: 21
        },
        {
          key: 'Other',
          value: 22
        }
      ]
    }
  ];


  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { super() }

  onSubmit() {
    this.dataService.post('api/Notifications', {
      productId: this.productId,
      type: this.type,
      comments: this.comments
    }, {
      authorization: true,
      showSpinner: true
    }).subscribe(() => {
      this.fade();
      this.openSuccessPrompt();
    });
  }


  async openSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Report Item';
        successPrompt.message = 'Thank you for your feedback.';
        successPrompt.reportItemForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
  }
}