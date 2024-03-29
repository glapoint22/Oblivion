import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownType, LazyLoadingService, SpinnerAction } from 'common';
import { Order } from '../../classes/order';
import { OrderProduct } from '../../classes/order-product';
import { QueriedOrderProduct } from '../../classes/queried-order-product';
import { OrdersSideMenuComponent } from '../../components/orders-side-menu/orders-side-menu.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { OrdersResolver } from '../../resolvers/orders/orders.resolver';
import { Breadcrumb } from '../../classes/breadcrumb';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public filters!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;
  public orders!: Array<Order>;
  public products!: Array<QueriedOrderProduct>;
  public isSearch!: boolean;
  public searchTerm!: string;
  public DropdownType = DropdownType;
  public breadcrumbs!: Array<Breadcrumb>;
  private routeParentDataSubscription!: Subscription;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      public lazyLoadingService: LazyLoadingService,
      private ordersResolver: OrdersResolver,
      private socialMediaService: SocialMediaService
    ) { }


  ngOnInit(): void {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(data => {
      this.filters = data.ordersData.filters;
      this.orders = data.ordersData.orders;
      this.products = data.ordersData.products;
      this.searchTerm = data.ordersData.searchTerm;
      this.selectedFilter = data.ordersData.selectedFilter;

      if (this.searchTerm) {
        this.isSearch = true;

        this.breadcrumbs = [
          {
            link: {
              name: 'Your Account',
              route: '/account'
            }
          },
          {
            link: {
              name: 'Your Orders',
              route: '/account/orders'
            }
          },
          {
            active: 'Order Search'
          }
        ]
      } else {
        this.isSearch = false;

        this.breadcrumbs = [
          {
            link: {
              name: 'Your Account',
              route: '/account'
            }
          },
          {
            active: 'Your Orders'
          }
        ]
      }
    });

    this.socialMediaService.addMetaTags('Your Orders');
  }




  onFilterChange(filter: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { 'filter': filter.value }
    });
  }



  getRecurringText(product: OrderProduct) {
    // let paymentsRemaining: number = 0;
    let frequency!: string;

    // if (product.paymentsRemaining < 50) paymentsRemaining = product.paymentsRemaining;

    switch (product.rebillFrequency) {
      case "DAYS":
        frequency = "";
        break;

      case "WEEKS":
        frequency = "";
        break;

      case "WEEKLY":
        frequency = "weekly ";
        break;

      case "BIWEEKLY":
        frequency = "biweekly ";
        break;

      case "MONTHS":
        frequency = "";
        break;

      case "MONTHLY":
        frequency = "monthly ";
        break;

      case "QUARTERLY":
        frequency = "quarterly ";
        break;
    }


    return frequency + 'payment of'

  }


  onSearch(value: string) {
    this.router.navigate([], {
      queryParams: { 'orderSearch': value }
    });
  }


  onVisitOfficialWebsiteClick(hoplink: string) {
    // Navigate to the product page
    window.open(hoplink, '_blank');
  }


  async onWriteReviewClick(order: Order) {
    this.lazyLoadingService.load(async () => {
      const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
      const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

      return {
        component: WriteReviewFormComponent,
        module: WriteReviewFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((writeReviewForm: WriteReviewFormComponent) => {
        writeReviewForm.productId = order.productId;
        writeReviewForm.productImage = order.products[0].image.src;
        writeReviewForm.productName = order.products[0].image.name;
      });
  }





  async onHamburgerButtonClick() {
    this.lazyLoadingService.load(async () => {
      const { OrdersSideMenuComponent } = await import('../../components/orders-side-menu/orders-side-menu.component');
      const { OrdersSideMenuModule } = await import('../../components/orders-side-menu/orders-side-menu.module');

      return {
        component: OrdersSideMenuComponent,
        module: OrdersSideMenuModule
      }
    }, SpinnerAction.StartEnd)
      .then((ordersSideMenu: OrdersSideMenuComponent) => {
        ordersSideMenu.filters = this.filters;
        ordersSideMenu.selectedFilter = this.selectedFilter;

        const ordersSideMenuOnApplySubscription = ordersSideMenu.onApply.subscribe((filter: KeyValue<string, string>) => {
          ordersSideMenuOnApplySubscription.unsubscribe();
          this.onFilterChange(filter);
        });
      });
  }


  onProductClick(product: OrderProduct | QueriedOrderProduct) {
    this.router.navigate([product.urlName, product.productId]);
  }


  getDate(date: string) {
    return new Date(date + 'Z');
  }


  ngOnDestroy(): void {
    this.ordersResolver.filters = null;
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
  }
}