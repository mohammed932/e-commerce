// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ApplicationRef } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingProvider } from '../../providers/loading/loading';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { AlertProvider } from '../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { CartPage } from '../cart/cart';
import { ReviewsPage } from '../reviews/reviews';



@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  public product;

  selectAttributes = new Array;
  selectedVariation = null;
  quantity = 1;
  discount_price;
  product_price;
  releatedItems = []; // <!-- 2.0 updates -->
  reviews = [];// <!-- 2.0 updates -->
  ratingStarsValue = null;// <!-- 2.0 updates -->
  public isLiked = 0;
  public wishArray = [];
  public disableCartButton = false;
  public variations = new Array;
  public groupProducts = new Array;
  public variationPrice = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public iab: InAppBrowser,
    public events: Events,
    private storage: Storage,
    public toast: Toast,
    public alert: AlertProvider,
    public translate: TranslateService,
    private applicationRef: ApplicationRef,
    private socialSharing: SocialSharing) {

    this.product = (JSON.parse(JSON.stringify(navParams.get('data'))));

    events.subscribe('wishListUpdate', (id, value) => {
      if (id == this.product.id) this.isLiked = value;
    });

    this.storage.get('wishListProducts').then((val) => {
      this.wishArray = val;
      this.checkWishList();
    });
    this.enableDisbaleCartButton();
    if (this.product.type == 'variable') { this.getVariations(); }
    if (this.product.type == 'grouped') { this.getGroupProducts(); }
    this.getRelatedItems(); // <!-- 2.0 updates -->
    this.getProductReviews();// <!-- 2.0 updates -->
  }
  //=================================================================================================================================================================================
  getGroupProducts() {
    this.loading.show();
    let count = 0;
    for (let value of this.product.grouped_products) {
      count++;
      this.config.Woocommerce.getAsync("products/" + value).then(data => {
        this.groupProducts.push(Object.assign(JSON.parse(data.body), { quantity: 0 }));
        this.applicationRef.tick();
      });
      if (count == this.product.grouped_products.length) this.loading.hide();
    }
  }
  //===============================================================================================================================
  getVariations() {
    this.loading.show();
    let count = 0;
    for (let value of this.product.variations) {
      count++;
      this.config.Woocommerce.getAsync("products/" + value).then(data => {
        this.variations.push(JSON.parse(data.body));

      });
      if (count == this.product.variations.length) { this.loading.hide(); this.applicationRef.tick(); }
    }

  }
  //===============================================================================================================================
  enableDisbaleCartButton() {
    // if (this.product.type == 'external') this.disableCartButton = true;
    // else
    if (this.product.type != 'variable' && this.product.in_stock) this.disableCartButton = false;
    else if (this.selectAttributes.length == this.product.attributes.length && this.product.in_stock) this.disableCartButton = false; else this.disableCartButton = true;
  }
  //===============================================================================================================================
  checkWishList() {
    //getting wishList items from local storage
    let count = 0;
    if (this.wishArray != null)
      for (let value of this.wishArray) {
        if (value.id == this.product.id) count++;
      }
    if (count != 0) this.isLiked = 1; else this.isLiked = 0;

  }
  //===============================================================================================================================
  openProduct() {
    this.loading.autoHide(2000);
    this.iab.create(this.product.external_url, "blank");
  }

  addToCartProduct() {
    let total = 0;

    this.loading.autoHide(500);
    // console.log(this.product);
    if (this.product.type == 'variable') { this.shared.addToCart(this.product, this.selectedVariation, this.quantity, this.selectAttributes); this.navCtrl.push(CartPage); }
    if (this.product.type == 'simple') { this.shared.addToCart(this.product, null, this.quantity, null); this.navCtrl.push(CartPage); }
    if (this.product.type == 'grouped') {

      for (let a of this.groupProducts) {
        total = total + a.quantity;
      }
      if (total == 0) this.translate.get("Please Add Quantity").subscribe((res) => { this.alert.show(res); });
      else
        for (let value of this.groupProducts) {
          if (value.quantity != 0) this.shared.addToCart(value, null, value.quantity, null);
        }
      if (total != 0) this.navCtrl.push(CartPage);
    }


  }

  //===============================================================================================================================
  //function adding attibute into array
  fillAttributes = function (val, key, position) {
    console.log(key + "  " + val);
    let count = 0;
    this.selectAttributes.forEach((value, index) => {
      if (value.position == position) { value.value = val; count++; }
      if (val == 'choose' && value.position == position) { this.selectAttributes.splice(index, 1); console.log("splice " + value.key + "  " + value.value); }

    });
    if (count == 0 && val != "choose") this.selectAttributes.push({ key: key, value: val, position: position });
    console.log(this.selectAttributes);

    if (this.product.attributes.length == this.selectAttributes.length)
      this.selectVariation();
    if (this.selectAttributes.length != this.product.attributes.length) {
      this.updateProductDetail(JSON.parse(JSON.stringify(this.navParams.get('data'))));
      this.variationPrice = null;
    }

    this.enableDisbaleCartButton();
  }
  //===============================================================================================================================
  selectVariation() {
    for (let i of this.variations) {

      if (i.attributes.length == 0) { this.selectedVariation = i; break; }
      let select = 0;
      for (let y of i.attributes) {
        for (let z of this.selectAttributes) {
          //if (y.id == z.id) {
          if (y.option.toUpperCase() == z.value.toUpperCase()) {
            select++;
            //console.log(y.option + "   " + z.value);
          }
          //}
        }
      }
      if (i.attributes.length == select) { this.selectedVariation = i; break; }
      // console.log(this.selectedVariation);
      // console.log(i.id + "   " + select);
    }
    if (this.selectAttributes != null)
      this.updateProductDetail(this.selectedVariation);


  }
  //===============================================================================================================================
  updateProductDetail(p) {
    // console.log(p);
    let oldProduct = JSON.parse(JSON.stringify(this.navParams.get('data')));
    this.product.name = p.name;
    this.product.price_html = p.price_html;
    this.product.images = p.images.concat(oldProduct.images);
  }
  //==============================================================================================================================================  
  //calculating total price  
  calculatingTotalPrice = function () {
    var price = parseFloat(this.product.products_price.toString());
    if (this.product.discount_price != null || this.product.discount_price != undefined)
      price = this.product.discount_price;
    var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

    if (this.product.discount_price != null || this.product.discount_price != undefined)
      this.discount_price = totalPrice;
    else
      this.product_price = totalPrice;
    //  console.log(totalPrice);
  };
  //===============================================================================================================================
  checkProductNew() {
    var pDate = new Date(this.product.date_created);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }
  //===============================================================================================================================
  qunatityGroupPlus = function (p) {
    //console.log(p.quantity);
    if (p.stock_quantity == null || p.stock_quantity > p.quantity) p.quantity++;
    else if (p.stock_quantity == p.quantity)
      this.translate.get("Product Quantity is Limited!").subscribe((res) => { this.alert.show(res); });
    this.applicationRef.tick();
    // console.log(p);
  }
  //===============================================================================================================================
  //function decreasing the quantity
  qunatityGroupMinus = function (p) {
    if (p.quantity != 0) {
      p.quantity--;
    }
  }
  //===============================================================================================================================
  qunatityPlus = function () {
    if (this.product.stock_quantity == null || this.product.stock_quantity > this.quantity) this.quantity++;
    else if (this.product.stock_quantity == this.quantity)
      this.translate.get("Product Quantity is Limited!").subscribe((res) => { this.alert.show(res); });
  }
  //===============================================================================================================================
  //function decreasing the quantity
  qunatityMinus = function () {
    if (this.quantity != 1) {
      this.quantity--;
    }
  }
  //===============================================================================================================================
  showProductDetail(id) {

    this.loading.show();
    this.config.Woocommerce.getAsync("products/" + id).then((data) => {
      //this.alert.show("loaded");
      this.loading.hide();
      this.navCtrl.push(ProductDetailPage, { data: JSON.parse(data.body) });
    }, err => {
      this.loading.hide();
      console.log(err);
    });


  }
  //===============================================================================================================================
  share() {
    this.loading.autoHide(1000);
    // Share via email
    this.socialSharing.share(
      this.product.name,
      this.product.name,
      this.product.images[0].src,
      this.product.permalink).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });

  }
  //===============================================================================================================================
  clickWishList() {

    if (this.isLiked == 0) { this.addWishList(); }
    else { this.removeWishList(); }
  }
  //===============================================================================================================================
  addWishList() {
    this.shared.addWishList(this.product);
  }
  //===============================================================================================================================
  removeWishList() {
    this.shared.removeWishList(this.product);
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  getRelatedItems() {
    let count = 0;
    let ary = [];
    for (let value of this.product.related_ids) {
      count++;
      this.config.Woocommerce.getAsync("products/" + value).then(data => {
        ary.push(JSON.parse(data.body));
        this.applicationRef.tick();
      });
      if (count == this.product.related_ids.length) { this.releatedItems = ary; }
    }
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  getProductReviews() {
    this.config.Woocommerce.getAsync("products/" + this.product.id + "/reviews").then(data => {
      this.reviews = JSON.parse(data.body);
      this.applicationRef.tick();
      this.totalRating();
    });
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  openReviewsPage() {
    this.navCtrl.push(ReviewsPage, { id: this.product.id });
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  totalRating() {
    let total = 0;
    for (let value of this.reviews) {
      total = total + value.rating;
    }

    let result = (total / this.reviews.length) * 20;
    if (total == 0) result = 0;
    this.ratingStarsValue = result;
    this.applicationRef.tick();


    //return result;
  }
}
