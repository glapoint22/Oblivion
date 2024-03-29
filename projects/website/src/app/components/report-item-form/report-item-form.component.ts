import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService, DropdownComponent, DropdownType, LazyLoad, LazyLoadingService, NotificationType, SpinnerAction } from 'common';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'report-item-form',
  templateUrl: './report-item-form.component.html',
  styleUrls: ['./report-item-form.component.scss']
})
export class ReportItemFormComponent extends LazyLoad {
  public DropdownType = DropdownType;
  public isFromRedirect!: boolean;
  public productId!: string;
  public comments!: string;
  public notificationType: number = NotificationType.ProductNameDoesNotMatchWithProductDescription;
  public whereTabElement!: ElementRef<HTMLElement>;
  public whatTabElement!: ElementRef<HTMLElement>;
  @ViewChild('whereDropdown') whereDropdown!: DropdownComponent;
  @ViewChild('whatDropdown') whatDropdown!: DropdownComponent;
  private dataServicePostSubscription!: Subscription;

  public listItems = [
    {
      key: 'Product Name',
      value: [
        {
          key: 'Doesn\'t match with product description',
          value: NotificationType.ProductNameDoesNotMatchWithProductDescription
        },
        {
          key: 'Doesn\'t match with product image',
          value: NotificationType.ProductNameDoesNotMatchWithProductImage
        },
        {
          key: 'Other',
          value: NotificationType.ProductNameOther
        }
      ]
    },
    {
      key: 'Price',
      value: [
        {
          key: 'Too high',
          value: NotificationType.ProductPriceTooHigh
        },
        {
          key: 'Not correct',
          value: NotificationType.ProductPriceNotCorrect
        },
        {
          key: 'Other',
          value: NotificationType.ProductPriceOther
        }
      ]
    },
    {
      key: 'Videos & Images',
      value: [
        {
          key: 'Different from product',
          value: NotificationType.VideosAndImagesAreDifferentFromProduct
        },
        {
          key: 'Not enough',
          value: NotificationType.NotEnoughVideosAndImages
        },
        {
          key: 'Not clear',
          value: NotificationType.VideosAndImagesNotClear
        },
        {
          key: 'Misleading',
          value: NotificationType.VideosAndImagesMisleading
        },
        {
          key: 'Other',
          value: NotificationType.VideosAndImagesOther
        }
      ]
    },
    {
      key: 'Product Description',
      value: [
        {
          key: 'Incorrect description',
          value: NotificationType.ProductDescriptionIncorrect
        },
        {
          key: 'Too vague',
          value: NotificationType.ProductDescriptionTooVague
        },
        {
          key: 'Misleading',
          value: NotificationType.ProductDescriptionMisleading
        },
        {
          key: 'Other',
          value: NotificationType.ProductDescriptionOther
        }
      ]
    },
    {
      key: 'Offensive Product',
      value: [
        {
          key: 'Illegal product',
          value: NotificationType.ProductReportedAsIllegal
        },
        {
          key: 'Adult content',
          value: NotificationType.ProductReportedAsHavingAdultContent
        },
        {
          key: 'Other',
          value: NotificationType.OffensiveProductOther
        }
      ]
    },
    {
      key: 'Missing Product',
      value: [
        {
          key: 'Inactive product',
          value: NotificationType.ProductInactive
        },
        {
          key: 'Product site is no longer in service',
          value: NotificationType.ProductSiteNolongerInService
        },
        {
          key: 'Other',
          value: NotificationType.MissingProductOther
        }
      ]
    }
  ];


  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  setWhatDropdownSelectedListItem() {
    window.setTimeout(() => {
      this.whatDropdown.selectedListItem = this.whatDropdown.list[0];
    })
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.base.nativeElement.focus();
    this.tabElements = [];
    this.tabElements.push(this.whereTabElement)
    this.tabElements.push(this.whatTabElement)
    this.tabElements = this.tabElements.concat(this.HTMLElements.toArray());
  }


  onSubmit() {
    this.dataServicePostSubscription = this.dataService.post('api/Notifications/PostProductNotification', {
      type: this.notificationType,
      productId: this.productId,
      text: this.comments != null && this.comments.trim().length > 0 ? this.comments.trim() : null
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    }).subscribe(() => {
      this.openSuccessPrompt();
    });
  }


  async openSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Report Item';
        successPrompt.message = 'Thank you for your feedback.';
      });
  }


  onEscape(): void {
    if (!this.whereDropdown.dropdownList && !this.whatDropdown.dropdownList) {
      this.close();
    }
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServicePostSubscription) this.dataServicePostSubscription.unsubscribe();
  }
}