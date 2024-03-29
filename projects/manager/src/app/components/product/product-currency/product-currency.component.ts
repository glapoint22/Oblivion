import { Component } from '@angular/core';
import { ProductComponent } from '../product.component';
import { CurrencyPopupComponent } from '../../currency-popup/currency-popup.component';
import { SpinnerAction } from 'common';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'product-currency',
  templateUrl: './product-currency.component.html',
  styleUrls: ['./product-currency.component.scss']
})
export class ProductCurrencyComponent extends ProductComponent {
  private currencyPopup!: CurrencyPopupComponent;
  public currency!: string;
  private currencies: Array<KeyValue<string, string>> = [
    {
      key: 'United States dollar',
      value: 'USD'
    },
    {
      key: 'Andorran peseta',
      value: 'ADP'
    },
    {
      key: 'Afghan afghani',
      value: 'AFN'
    },
    {
      key: 'Albanian lek',
      value: 'ALL'
    },
    {
      key: 'Armenian dram',
      value: 'AMD'
    },
    {
      key: 'Angolan kwanza',
      value: 'AOA'
    },
    {
      key: 'Argentine peso',
      value: 'ARS'
    },
    {
      key: 'Australian dollar',
      value: 'AUD'
    },
    {
      key: 'Bosnia and Herzegovina convertible mark',
      value: 'BAM'
    },
    {
      key: 'Barbados dollar',
      value: 'BBD'
    },
    {
      key: 'Bangladeshi taka',
      value: 'BDT'
    },
    {
      key: 'Bahraini dinar',
      value: 'BHD'
    },
    {
      key: 'Burundian franc',
      value: 'BIF'
    },
    {
      key: 'Bermudian dollar',
      value: 'BMD'
    },
    {
      key: 'Brunei dollar',
      value: 'BND'
    },
    {
      key: 'Boliviano',
      value: 'BOB'
    },
    {
      key: 'Brazilian real',
      value: 'BRL'
    },
    {
      key: 'Bahamian dollar',
      value: 'BSD'
    },
    {
      key: 'Botswana pula',
      value: 'BWP'
    },
    {
      key: 'Belarusian ruble',
      value: 'BYN'
    },
    {
      key: 'Belarusian ruble',
      value: 'BYR'
    },
    {
      key: 'Belize dollar',
      value: 'BZD'
    },
    {
      key: 'Canadian dollar',
      value: 'CAD'
    },
    {
      key: 'Swiss franc',
      value: 'CHF'
    },
    {
      key: 'Unidad de Fomento',
      value: 'CLF'
    },
    {
      key: 'Chilean peso',
      value: 'CLP'
    },
    {
      key: 'RenminbiRenminbi (Chinese) yuan',
      value: 'CNY'
    },
    {
      key: 'Colombian peso',
      value: 'COP'
    },
    {
      key: 'Costa Rican colon',
      value: 'CRC'
    },
    {
      key: 'Cuban convertible peso',
      value: 'CUC'
    },
    {
      key: 'Cuban peso',
      value: 'CUP'
    },
    {
      key: 'Czech koruna',
      value: 'CZK'
    },
    {
      key: 'Djiboutian franc',
      value: 'DJF'
    },
    {
      key: 'Danish krone',
      value: 'DKK'
    },
    {
      key: 'Dominican peso',
      value: 'DOP'
    },
    {
      key: 'Egyptian pound',
      value: 'EGP'
    },
    {
      key: 'Spanish peseta',
      value: 'ESP'
    },
    {
      key: 'Euro',
      value: 'EUR'
    },
    {
      key: 'Fijian dollarFiji dollar',
      value: 'FJD'
    },
    {
      key: 'Falkland Islands pound',
      value: 'FKP'
    },
    {
      key: 'Pound sterling',
      value: 'GBP'
    },
    {
      key: 'Georgian lari',
      value: 'GEL'
    },
    {
      key: 'Gibraltar pound',
      value: 'GIP'
    },
    {
      key: 'Guinean franc',
      value: 'GNF'
    },
    {
      key: 'Guatemalan quetzal',
      value: 'GTQ'
    },
    {
      key: 'Guyanese dollar',
      value: 'GYD'
    },
    {
      key: 'Hong Kong dollar',
      value: 'HKD'
    },
    {
      key: 'Honduran lempira',
      value: 'HNL'
    },
    {
      key: 'Croatian kuna',
      value: 'HRK'
    },
    {
      key: 'Hungarian forint',
      value: 'HUF'
    },
    {
      key: 'Indonesian rupiah',
      value: 'IDR'
    },
    {
      key: 'Israeli new shekel',
      value: 'ILS'
    },
    {
      key: 'Indian rupee',
      value: 'INR'
    },
    {
      key: 'Iraqi dinar',
      value: 'IQD'
    },
    {
      key: 'Iranian rial',
      value: 'IRR'
    },
    {
      key: 'Icelandic krona',
      value: 'ISK'
    },
    {
      key: 'Italian lira',
      value: 'ITL'
    },
    {
      key: 'Jamaican dollar',
      value: 'JMD'
    },
    {
      key: 'Jordanian dinar',
      value: 'JOD'
    },
    {
      key: 'Japanese yen',
      value: 'JPY'
    },
    {
      key: 'Cambodian riel',
      value: 'KHR'
    },
    {
      key: 'Comoro franc',
      value: 'KMF'
    },
    {
      key: 'North Korean won',
      value: 'KPW'
    },
    {
      key: 'South Korean won',
      value: 'KRW'
    },
    {
      key: 'Kuwaiti dinar',
      value: 'KWD'
    },
    {
      key: 'Cayman Islands dollar',
      value: 'KYD'
    },
    {
      key: 'Kazakhstani tenge',
      value: 'KZT'
    },
    {
      key: 'Lao kip',
      value: 'LAK'
    },
    {
      key: 'Lebanese pound',
      value: 'LBP'
    },
    {
      key: 'Sri Lankan rupee',
      value: 'LKR'
    },
    {
      key: 'Liberian dollar',
      value: 'LRD'
    },
    {
      key: 'Lithuanian litas',
      value: 'LTL'
    },
    {
      key: 'Luxembourg franc',
      value: 'LUF'
    },
    {
      key: 'Latvian lats',
      value: 'LVL'
    },
    {
      key: 'Libyan dinar',
      value: 'LYD'
    },
    {
      key: 'Malagasy ariary',
      value: 'MGA'
    },
    {
      key: 'Malagasy franc',
      value: 'MGF'
    },
    {
      key: 'Myanmar kyat',
      value: 'MMK'
    },
    {
      key: 'Mongolian tugrik',
      value: 'MNT'
    },
    {
      key: 'Mauritanian Ouguiya',
      value: 'MRO'
    },
    {
      key: 'Mauritian rupee',
      value: 'MUR'
    },
    {
      key: 'Mexican peso',
      value: 'MXN'
    },
    {
      key: 'Malaysian ringgit',
      value: 'MYR'
    },
    {
      key: 'Namibian dollar',
      value: 'NAD'
    },
    {
      key: 'Nigerian naira',
      value: 'NGN'
    },
    {
      key: 'Nicaraguan cordoba',
      value: 'NIO'
    },
    {
      key: 'Norwegian krone',
      value: 'NOK'
    },
    {
      key: 'Nepalese rupee',
      value: 'NPR'
    },
    {
      key: 'New Zealand dollar',
      value: 'NZD'
    },
    {
      key: 'Omani rial',
      value: 'OMR'
    },
    {
      key: 'Philippine peso',
      value: 'PHP'
    },
    {
      key: 'Pakistani rupee',
      value: 'PKR'
    },
    {
      key: 'Polish zloty',
      value: 'PLN'
    },
    {
      key: 'Paraguayan guarani',
      value: 'PYG'
    },
    {
      key: 'Romanian leu',
      value: 'RON'
    },
    {
      key: 'Serbian dinar',
      value: 'RSD'
    },
    {
      key: 'Russian ruble',
      value: 'RUB'
    },
    {
      key: 'Russian ruble',
      value: 'RUR'
    },
    {
      key: 'Rwandan franc',
      value: 'RWF'
    },
    {
      key: 'Solomon Islands dollar',
      value: 'SBD'
    },
    {
      key: 'Swedish krona/kronor',
      value: 'SEK'
    },
    {
      key: 'Singapore dollar',
      value: 'SGD'
    },
    {
      key: 'Saint Helena pound',
      value: 'SHP'
    },
    {
      key: 'Sierra Leonean leone',
      value: 'SLL'
    },
    {
      key: 'Somali shilling',
      value: 'SOS'
    },
    {
      key: 'Surinamese dollar',
      value: 'SRD'
    },
    {
      key: 'South Sudanese pound',
      value: 'SSP'
    },
    {
      key: 'Sao Tome/Principe Dobra',
      value: 'STD'
    },
    {
      key: 'Sao Tome/Principe Dobra',
      value: 'STN'
    },
    {
      key: 'Syrian pound',
      value: 'SYP'
    },
    {
      key: 'Thai baht',
      value: 'THB'
    },
    {
      key: 'Turkmenistani manat',
      value: 'TMM'
    },
    {
      key: 'Tunisian dinar',
      value: 'TND'
    },
    {
      key: 'Tongan paanga',
      value: 'TOP'
    },
    {
      key: 'Turkish lira',
      value: 'TRY'
    },
    {
      key: 'Trinidad and Tobago dollar',
      value: 'TTD'
    },
    {
      key: 'New Taiwan dollar',
      value: 'TWD'
    },
    {
      key: 'Tanzanian shilling',
      value: 'TZS'
    },
    {
      key: 'Ukrainian hryvnia',
      value: 'UAH'
    },
    {
      key: 'Ugandan shilling',
      value: 'UGX'
    },
    {
      key: 'Uruguay Peso en Unidades Indexadas',
      value: 'UYI'
    },
    {
      key: 'Uruguayan peso',
      value: 'UYU'
    },
    {
      key: 'Uzbekistan som',
      value: 'UZS'
    },
    {
      key: 'Venezuelan bolivar',
      value: 'VEF'
    },
    {
      key: 'Vietnamese dong',
      value: 'VND'
    },
    {
      key: 'Vanuatu vatu',
      value: 'VUV'
    },
    {
      key: 'CFA franc BEAC',
      value: 'XAF'
    },
    {
      key: 'East Caribbean dollar',
      value: 'XCD'
    },
    {
      key: 'CFA franc BCEAO',
      value: 'XOF'
    },
    {
      key: 'CFP franc (franc Pacifique)',
      value: 'XPF'
    },
    {
      key: 'Yemeni rial',
      value: 'YER'
    },
    {
      key: 'South African rand',
      value: 'ZAR'
    },
    {
      key: 'Zambian kwacha',
      value: 'ZMK'
    },
    {
      key: 'Zambian kwacha',
      value: 'ZMW'
    },
    {
      key: 'Zimbabwean dollar',
      value: 'ZWD'
    }
  ];


  ngOnInit() {
    this.currency = this.currencies.find(x => x.value == this.product.currency)?.key!;
  }

  openCurrencyPopup() {
    if (this.popupOpen) {
      this.currencyPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { CurrencyPopupComponent } = await import('../../currency-popup/currency-popup.component');
      const { CurrencyPopupModule } = await import('../../currency-popup/currency-popup.module');
      return {
        component: CurrencyPopupComponent,
        module: CurrencyPopupModule
      }
    }, SpinnerAction.None, this.editPopupContainer)
      .then((currencyPopup: CurrencyPopupComponent) => {
        this.popupOpen = true;
        this.currencyPopup = currencyPopup;
        currencyPopup.currency = this.product.currency;
        currencyPopup.currencies = this.currencies;

        currencyPopup.callback = (currency: any) => {
          this.dataService.put('api/Products/Currency', {
            productId: this.product.id,
            currency: currency.value
          }, {
            authorization: true
          }).subscribe();

          this.product.currency = currency.value;
          this.currency = currency.key;
        }

        const onCurrencyPopupCloseListener = this.currencyPopup.onClose.subscribe(() => {
          onCurrencyPopupCloseListener.unsubscribe();
          this.popupOpen = false;
        });
      });
  }
}