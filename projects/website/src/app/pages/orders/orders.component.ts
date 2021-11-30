import { KeyValue } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Order } from '../../classes/order';
import { OrderProduct } from '../../classes/order-product';
import { ProductOrders } from '../../classes/product-orders';
import { QueriedOrderProduct } from '../../classes/queried-order-product';
import { OrdersSideMenuComponent } from '../../components/orders-side-menu/orders-side-menu.component';
import { WriteReviewFormComponent } from '../../components/write-review-form/write-review-form.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {
  public filters!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;
  public orders!: Array<Order>;
  public products!: Array<QueriedOrderProduct>;
  public isSearch!: boolean;
  public searchTerm!: string;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private lazyLoadingService: LazyLoadingService) { }

  ngAfterViewInit(): void {
    // Get the filters
    this.dataService.get<Array<KeyValue<string, string>>>('api/ProductOrders/Filters', undefined, true)
      .subscribe((filters: Array<KeyValue<string, string>>) => {
        this.filters = filters;

        // Get the orders and products
        this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
          // Parameters we will pass to the server
          let parameters: Array<KeyValue<string, string>> = [];

          this.searchTerm = queryParams.get('orderSearch') as string;

          if (this.searchTerm) {
            this.isSearch = true;
          } else {
            this.isSearch = false;
          }

          // Get all the query params from the url and assign it to the parameters array
          for (let i = 0; i < queryParams.keys.length; i++) {
            parameters.push({ key: queryParams.keys[i], value: queryParams.get(queryParams.keys[i]) as string });
          }

          this.dataService.get<ProductOrders>('api/ProductOrders', parameters, true)
            .subscribe((productOrders: ProductOrders) => {
              this.orders = productOrders.orders;
              this.products = productOrders.products;

              if (this.orders) {
                const index = Math.max(0, this.filters.findIndex(x => x.value == queryParams.get('filter')));
                this.selectedFilter = this.filters[index];
              }
            });
        });
      });


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
    const { WriteReviewFormComponent } = await import('../../components/write-review-form/write-review-form.component');
    const { WriteReviewFormModule } = await import('../../components/write-review-form/write-review-form.module');

    this.lazyLoadingService.getComponentAsync(WriteReviewFormComponent, WriteReviewFormModule, this.lazyLoadingService.container)
      .then((writeReviewForm: WriteReviewFormComponent) => {
        writeReviewForm.productId = order.productId;
        writeReviewForm.productImage = order.products[0].image;
      });
  }





  async onHamburgerButtonClick() {
    const { OrdersSideMenuComponent } = await import('../../components/orders-side-menu/orders-side-menu.component');
    const { OrdersSideMenuModule } = await import('../../components/orders-side-menu/orders-side-menu.module');

    this.lazyLoadingService.getComponentAsync(OrdersSideMenuComponent, OrdersSideMenuModule, this.lazyLoadingService.container)
      .then((ordersSideMenu: OrdersSideMenuComponent) => {
        ordersSideMenu.filters = this.filters;
        ordersSideMenu.selectedFilter = this.selectedFilter;

        ordersSideMenu.onApply.subscribe((filter: KeyValue<string, string>) => {
          this.onFilterChange(filter);
        });
      });

  }
}