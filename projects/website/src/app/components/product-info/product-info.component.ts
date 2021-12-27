import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MediaType } from '../../classes/enums';
import { Media } from '../../classes/media';
import { Product } from '../../classes/product';
import { AddToListFormComponent } from '../../components/add-to-list-form/add-to-list-form.component';
import { ReportItemFormComponent } from '../../components/report-item-form/report-item-form.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnChanges {
  public selectedMedia!: Media;
  public mediaType = MediaType;
  @Input() product!: Product;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;


  constructor(private lazyLoadingService: LazyLoadingService) { }


  ngOnChanges() {
    this.selectedMedia = this.product.media[0];
  }

  async onAddToListClick() {
    const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
    const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

    this.lazyLoadingService.getComponentAsync(AddToListFormComponent, AddToListFormModule, this.lazyLoadingService.container)
      .then((addToListForm: AddToListFormComponent) => {
        addToListForm.product = this.product;
      });
  }


  onMediaClick(media: Media) {
    this.selectedMedia = media;
    if (media.type == MediaType.Video) {
      this.iframe.nativeElement.src = media.video;
    } else {
      this.iframe.nativeElement.src = '';
    }

  }

  onVisitOfficialWebsiteClick() {
    // Navigate to the product page
    window.open(this.product.hoplink, '_blank');
  }


  async onReportItemClick() {
    const { ReportItemFormComponent } = await import('../../components/report-item-form/report-item-form.component');
    const { ReportItemFormModule } = await import('../../components/report-item-form/report-item-form.module');

    this.lazyLoadingService.getComponentAsync(ReportItemFormComponent, ReportItemFormModule, this.lazyLoadingService.container)
      .then((reportItemForm: ReportItemFormComponent) => {

      });
  }


  



}
