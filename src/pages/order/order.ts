// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild, ApplicationRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { ThankYouPage } from '../thank-you/thank-you';
import { CouponProvider } from '../../providers/coupon/coupon';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';



@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  @ViewChild(Content) content: Content;

  customerNotes;
  discount = 0;
  productsTotal = 0;
  totalAmountWithDisocunt = 0;
  paymentMethods = [];
  selectedPaymentMethod = '';
  selectedPaymentMethodTitle = '';
  order = {};
  tax = 0;

  options: ThemeableBrowserOptions = {
    statusbar: {
      color: '#ffffffff'
    },
    toolbar: {
      height: 44,
      color: '#f0f0f0ff'
    },
    title: {
      color: '#003264ff',
      showPageTitle: false
    },
    closeButton: {
      wwwImage: 'assets/close.png',
      align: 'right',
      event: 'closePressed'
    },
    backButtonCanClose: true
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public loading: LoadingProvider,
    public alert: AlertProvider,
    public couponProvider: CouponProvider,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    private themeableBrowser: ThemeableBrowser,
    public iab: InAppBrowser,
    private applicationRef: ApplicationRef, ) {
    this.order = {
      token: this.shared.customerData.cookie,
      payment_method: this.selectedPaymentMethod,
      payment_method_title: this.selectedPaymentMethodTitle,
      billing: this.shared.billing,
      shipping: this.shared.shipping,
      line_items: this.shared.cartProducts,
      shipping_lines: this.shared.shipping_lines,
      coupon_lines: this.shared.couponArray,
      customer_note: this.customerNotes,
      customer_id: this.shared.customerData.id,
    };

    //this.productsTotal = this.shared.productsTotal();
    this.calculateDiscount();
    this.calculateTotal();

    // if (this.shared.shipping_lines[0].method_id != "local_pickup")
    //   this.calculateTax();
  }

  //============================================================================================  
  //placing order
  addOrder = function (nonce) {

    this.loading.show();
    var data = {
      token: this.shared.customerData.cookie,
      payment_method: this.selectedPaymentMethod,
      payment_method_title: this.selectedPaymentMethodTitle,
      billing_info: this.shared.billing,
      shipping_info: this.shared.shipping,
      products: this.getProducts(),
      shipping_ids: this.shared.shipping_lines,
      coupons: this.getCoupons(),
      customer_note: this.customerNotes,
      customer_id: this.shared.customerData.id,
    };
    console.log(this.shared.customerData);
    //console.log(data);
    // let options = {
    //   location: "no",
    //   presentationstyle: "formsheet",
    //   zoom: 'no',
    //   hidden: "yes"
    // }
    const b: ThemeableBrowserObject = this.themeableBrowser.create(this.config.url + '/mobile-checkout/?order=' + JSON.stringify(data), '_blank', this.options);
    // const b = this.iab.create(this.config.url + '/mobile-checkout/?order=' + JSON.stringify(data), "_blank", options);
    let orderPlaced = false;
    b.on('loadstart').subscribe(res => {
      //this.spinnerDialog.show("", "Message", true, { overlayOpacity: 0.70 });
      if (res.url.indexOf('order-received') != -1) {
        orderPlaced = true;
      } else if (res.url.indexOf('cancel_order=true') != -1) {
        b.close();
      }
    });
    b.on('closePressed').subscribe(res => {
      b.close();
    });
    b.on('loadstop').subscribe(res => {
      b.insertCss({ code: ".site-header, nav, #secondary, footer {display: none!important;}" })
        .then((e) => {
          this.loading.hide();
          setTimeout(() => {
            b.show();
          }, 500);
          console.log('CSS Applied');
          //this.spinnerDialog.hide();
        })
        .catch((e) => { console.log(e); });
    });

    b.on('exit').subscribe(res => {
      if (orderPlaced) this.navCtrl.setRoot(ThankYouPage);
    });
  };

  getProducts() {
    var data = [];
    for (let v of this.shared.cartProducts) {
      var obj = { quantity: v.quantity, product_id: v.product_id, total: v.total.toString() };
      if (v.variation_id) Object.assign(obj, { variation_id: v.variation_id })
      //if (v.meta_data) Object.assign(obj, { meta_data: v.meta_data })
      data.push(obj);
    }
    return data;
  }
  //Object.assign(c, JSON.parse(data.body)
  getCoupons() {
    var data = [];
    for (let v of this.shared.couponArray) {
      data.push({ code: v.code, discount: v.amount });
    }
    return data;
  }
  getShippingLines() {
    var data = [];
    for (let v of this.shared.shipping_lines) {
      data.push({ code: v.code, discount: v.amount });
    }
    return data;
  }

  //============================================================================================  
  //CAlculate Discount total
  calculateDiscount = function () {
    let total = 0;
    for (let value of this.shared.cartProducts) {
      total = total + parseFloat(value.subtotal);
    }
    this.productsTotal = total;
    this.discount = parseFloat(this.shared.productsTotal()) - total;
  };

  //============================================================================================  
  //CAlculate all total
  calculateTotal = function () {
    this.totalAmountWithDisocunt = (parseFloat(this.productsTotal) + parseFloat(this.shared.shipping_lines[0].total)) + parseFloat(this.discount);
  };

  selectPayment(p) {
    this.selectedPaymentMethod = p.id;
    this.selectedPaymentMethodTitle = p.title;
    this.scrollToBottom();
  }

  //========================================================================================
  scrollToBottom() {

    setTimeout(() => {
      this.content.scrollToBottom();
      console.log("botton");
    }, 300);

  }
  ngOnInit() {
    this.loading.show();
    this.config.Woocommerce.getAsync("payment_gateways").then((data) => {
      this.loading.hide();
      this.paymentMethods = JSON.parse(data.body);
      this.applicationRef.tick();
    });


  }
  openHomePage() {
    this.navCtrl.popToRoot();
  }

  calculateTax() {
    console.log(this.shared.cartProducts);
    let total;
    for (let value of this.shared.cartProducts) {
      let v;
      if (value.tax_status == "taxable") v = this.getProductTax(value);
      total = total + v;
    }
    this.tax = total;
  }

  getProductTax(product) {
    if (product.tax_class == "") product.tax_class = "standard"
    let rate = 0;
    let discount;
    this.loading.show();
    for (let value of this.shared.listTaxRates) {
      console.log(product.tax_class == value.class);
      if (this.shared.shipping.country == value.country && product.tax_class == value.class) {
        rate = parseFloat(value.rate);
        console.log("CountryMatched" + value.rate);
        if (this.shared.shipping.state == value.state) {
          rate = parseFloat(value.rate);
          console.log("StateMatched" + value.rate);
          if (this.shared.shipping.postcode == value.postcode) {
            console.log("postcode" + value.rate);
            rate = parseFloat(value.rate);
            break;
          }
        }
      }
    }
    this.loading.hide();
    discount = (parseFloat(product.total) / 100) * rate;
    console.log(discount);
    return discount;
  }

}
