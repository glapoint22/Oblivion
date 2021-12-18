import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class ProductInfoComponent implements OnInit {
  public selectedMedia!: Media;
  public mediaType = MediaType;
  @Input() product!: Product;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;


  constructor(private lazyLoadingService: LazyLoadingService) { }


  ngOnInit() {
    this.selectedMedia = this.product.media[0];
  }

  async onAddToListClick() {
    const { AddToListFormComponent } = await import('../../components/add-to-list-form/add-to-list-form.component');
    const { AddToListFormModule } = await import('../../components/add-to-list-form/add-to-list-form.module');

    this.lazyLoadingService.getComponentAsync(AddToListFormComponent, AddToListFormModule, this.lazyLoadingService.container)
      .then((addToListForm: AddToListFormComponent) => {

      });
  }


  onMediaClick(media: Media) {
    this.selectedMedia = media;
    if (media.type == MediaType.Video) {
      this.iframe.nativeElement.src = media.videoUrl;
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


  // onScrollbarTouchStart(e: TouchEvent, scrollbar: HTMLElement) {
    
  // }


  // onScrollbarTouchMove(e: TouchEvent, scrollbar: HTMLElement, sliderContainer: HTMLElement) {
  //   scrollbar.style.left = (e.changedTouches[0].clientX - this.scrollbarStartClientX) + "px";


  //   if(scrollbar.offsetLeft < 10) {
  //     scrollbar.style.left = "10px";
  //   }

  //   if(scrollbar.offsetLeft + scrollbar.clientWidth > sliderContainer.clientWidth + 10) {
  //     scrollbar.style.left = sliderContainer.clientWidth + 10 - scrollbar.clientWidth + "px";

      
  //   }
  // }



}
