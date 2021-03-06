import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Order } from '../../classes/order';
import { OrderProduct } from '../../classes/order-product';
import { QueriedOrderProduct } from '../../classes/queried-order-product';
import { OrdersSideMenuComponent } from '../../components/orders-side-menu/orders-side-menu.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { OrdersResolver } from '../../resolvers/orders/orders.resolver';

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

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private lazyLoadingService: LazyLoadingService,
      private ordersResolver: OrdersResolver
    ) { }


  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.filters = data.ordersData.filters;
      this.orders = data.ordersData.orders;
      this.products = data.ordersData.products;
      this.searchTerm = data.ordersData.searchTerm;
      this.selectedFilter = data.ordersData.selectedFilter;

      if (this.searchTerm) {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    })
  }




  onFilterChange(filter: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { 'filter': filter.value }
    });
  }



  getRecurringText(product: OrderProduct) {
    let paymentsRemaining: number = 0;
    let frequency!: string;

    if (product.paymentsRemaining < 50) paymentsRemaining = product.paymentsRemaining;

    switch (product.rebillFrequency) {
      case "DAYS":
        frequency = "";
        break;

      case "WEEKS":
        frequency = "";
        break;

      case "WEEKLY":
        frequency = "weekly";
        break;

      case "BIWEEKLY":
        frequency = "biweekly";
        break;

      case "MONTHS":
        frequency = "";
        break;

      case "MONTHLY":
        frequency = "monthly";
        break;

      case "QUARTERLY":
        frequency = "quarterly";
        break;
    }


    return paymentsRemaining + ' ' + frequency + ' payment' + (paymentsRemaining != 0 ? 's' : '') + ' of'

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

        ordersSideMenu.onApply.subscribe((filter: KeyValue<string, string>) => {
          this.onFilterChange(filter);
        });
      });
  }


  onProductClick(product: OrderProduct | QueriedOrderProduct) {
    this.router.navigate([product.urlName, product.urlId]);
  }


  ngOnDestroy(): void {
    this.ordersResolver.filters = null;
  }
}