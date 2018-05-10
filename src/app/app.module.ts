import { PhoneVerificationPage } from './../pages/phone-verification/phone-verification';
// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
// Version: 1.0

if (localStorage.langId == undefined) {
  localStorage.langId = '1';
}
if (localStorage.direction == undefined) {
  localStorage.direction = 'ltr';
}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from '../providers/config/config';
import { createTranslateLoader } from '../providers/translate/translate';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { ProductsProvider } from '../providers/products/products';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginPage } from '../pages/login/login';

import { IntroPage } from '../pages/intro/intro';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { LoadingProvider } from '../providers/loading/loading';
import { SharedDataProvider } from '../providers/shared-data/shared-data';

import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

import { BannersComponent } from '../components/banners/banners';
import { ProductComponent } from '../components/product/product';
import { FooterComponent } from '../components/footer/footer';
import { SlidingTabsComponent } from '../components/sliding-tabs/sliding-tabs';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { HeaderComponent } from '../components/header/header';
import { CartPage } from '../pages/cart/cart';
import { CurencyPipe } from '../pipes/curency/curency';
import { Toast } from '@ionic-native/toast';
import { SearchPage } from '../pages/search/search';
import { AlertProvider } from '../providers/alert/alert';
import { CategoriesPage } from '../pages/categories/categories';
import { ProductsPage } from '../pages/products/products';
import { WishListPage } from '../pages/wish-list/wish-list';
import { ShippingAddressPage } from '../pages/shipping-address/shipping-address';
import { SelectCountryPage } from '../pages/select-country/select-country';
import { SelectZonesPage } from '../pages/select-zones/select-zones';
import { BillingAddressPage } from '../pages/billing-address/billing-address';
import { ShippingMethodPage } from '../pages/shipping-method/shipping-method';
import { OrderPage } from '../pages/order/order';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ThankYouPage } from '../pages/thank-you/thank-you';
import { Stripe } from '@ionic-native/stripe';
import { CouponProvider } from '../providers/coupon/coupon';
import { PayPal } from '@ionic-native/paypal';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { SettingsPage } from '../pages/settings/settings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Categories2Page } from '../pages/categories2/categories2';
import { SubCategoriesPage } from '../pages/sub-categories/sub-categories';
import { Home5Page } from '../pages/home5/home5';
import { Home4Page } from '../pages/home4/home4';
import { Home3Page } from '../pages/home3/home3';
import { Home2Page } from '../pages/home2/home2';
import { Categories3Page } from '../pages/categories3/categories3';
import { Categories4Page } from '../pages/categories4/categories4';
import { Categories5Page } from '../pages/categories5/categories5';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermServicesPage } from '../pages/term-services/term-services';
import { RefundPolicyPage } from '../pages/refund-policy/refund-policy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Network } from '@ionic-native/network';
import { SubCategories2Page } from '../pages/sub-categories2/sub-categories2';
import { SubCategories3Page } from '../pages/sub-categories3/sub-categories3';
import { SubCategories4Page } from '../pages/sub-categories4/sub-categories4';
import { SubCategories5Page } from '../pages/sub-categories5/sub-categories5';
import { Categories6Page } from '../pages/categories6/categories6';
import { SubCategories6Page } from '../pages/sub-categories6/sub-categories6';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdMobFree } from '@ionic-native/admob-free';
import { FCM } from '@ionic-native/fcm';
import { AppVersion } from '@ionic-native/app-version';
import { OneSignal } from '@ionic-native/onesignal';
import { LocationDataProvider } from '../providers/location-data/location-data';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { ReviewsPage } from '../pages/reviews/reviews';
import { AddReviewPage } from '../pages/add-review/add-review';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import {Firebase} from '@ionic-native/firebase';

import * as firebase from 'firebase'


firebase.initializeApp({
  apiKey: "AIzaSyB1OFmu_ktSIli3MgeQxqkdkltfFxhtIuQ",
  authDomain: "e-mall-doha.firebaseapp.com",
  databaseURL: "https://e-mall-doha.firebaseio.com",
  projectId: "e-mall-doha",
  storageBucket: "e-mall-doha.appspot.com",
  messagingSenderId: "332348391478"
})

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    CartPage,
    Home2Page,
    Home3Page,
    Home4Page,
    Home5Page,
    SearchPage,
    CategoriesPage,
    Categories2Page,
    PhoneVerificationPage,
    Categories3Page,
    Categories4Page,
    Categories5Page,
    Categories6Page,
    IntroPage,
    SubCategoriesPage,
    SubCategories2Page,
    SubCategories3Page,
    SubCategories4Page,
    SubCategories5Page,
    SubCategories6Page,
    ProductsPage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
    LoginPage,
    SignUpPage,
    WishListPage,
    ShippingAddressPage,
    ForgotPasswordPage,
    HeaderComponent,
    BannersComponent,
    SelectZonesPage,
    BillingAddressPage,
    SelectCountryPage,
    MyAccountPage,
    ProductComponent,
    FooterComponent,
    SlidingTabsComponent,
    ProductDetailPage,
    CurencyPipe,
    ShippingMethodPage,
    ThankYouPage,
    OrderPage,
    OrderDetailPage,
    MyOrdersPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,
    SettingsPage,
    ReviewsPage,// <!-- 2.0 updates -->
    AddReviewPage // <!-- 2.0 updates -->

  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'md',
      mode: 'md',
    }),
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,// <!-- 2.0 updates start -->
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Home2Page,
    Home3Page,
    Home4Page,
    Home5Page,
    SearchPage,
    CategoriesPage,
    Categories2Page,
    Categories3Page,
    Categories4Page,
    Categories5Page,
    Categories6Page,
    SubCategoriesPage,
    SubCategories2Page,
    SubCategories3Page,
    SubCategories4Page,
    SubCategories5Page,
    PhoneVerificationPage,
    SubCategories6Page,
    IntroPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,

    ProductsPage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
    WishListPage,
    ShippingAddressPage,
    CartPage,
    LoginPage,
    SignUpPage,
    BillingAddressPage,
    SelectCountryPage,
    SelectZonesPage,
    MyAccountPage,
    ForgotPasswordPage,
    HeaderComponent,
    BannersComponent,
    ProductComponent,
    FooterComponent,
    SlidingTabsComponent,
    ProductDetailPage,
    ShippingMethodPage,
    OrderPage,
    MyOrdersPage,
    OrderDetailPage,
    ThankYouPage,
    SettingsPage,
    ReviewsPage,// <!-- 2.0 updates -->
    AddReviewPage // <!-- 2.0 updates -->
  ],
  providers: [
    ConfigProvider,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Toast,
    ConfigProvider,
    ProductsProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ProductsProvider,
    LoadingProvider,
    SharedDataProvider,
    Stripe,
    AlertProvider,
    CouponProvider,
    PayPal,
    Firebase,
    Push,
    Device,
    Facebook,
    GooglePlus,
    LocalNotifications,
    InAppBrowser,
    Network,
    AdMobFree,
    Firebase,
    FCM,
    AppVersion,
    OneSignal,
    LocationDataProvider,
    SpinnerDialog,
    ThemeableBrowser
  ]
})
export class AppModule { }
