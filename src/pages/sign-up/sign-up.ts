import { PhoneVerificationPage } from './../phone-verification/phone-verification';
import { Component } from '@angular/core';
import { ViewController, ModalController, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ConfigProvider } from '../../providers/config/config';
import { Http } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Firebase } from '@ionic-native/firebase';
import * as firebase from 'firebase'


@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  /* mobile verification itialization section*/
  phoneNumber: any = '';
  verificationId: any = ''
  isPhoneVerified: boolean = false
  isWaiting: boolean = false
  /* end verification intialization */

  formData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    username: ''
  };
  image;
  errorMessage = '';
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private toastCtrl: ToastController,
    public platform: Platform,

  ) {
  }

  signUp() {
    if (this.isPhoneVerified) {
      this.loading.show();
      this.errorMessage = '';
      this.config.Woocommerce.postAsync("customers", this.formData).then((data) => {
        this.loading.hide();
        let dat = JSON.parse(data.body);
        console.log(dat);
        if (dat.message == undefined) {

          this.shared.login(dat);
          this.viewCtrl.dismiss();
        }
        if (dat.message != undefined)
          this.errorMessage = dat.message;
      });
    } else {
       this.presentToast('يرجي التحقق من رقم الهاتف اولا')
    }

  }

  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create('PrivacyPolicyPage');
    modal.present();
  }
  openTermServicesPage() {
    let modal = this.modalCtrl.create('TermServicesPage');
    modal.present();
  }
  openRefundPolicyPage() {
    let modal = this.modalCtrl.create('RefundPolicyPage');
    modal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(LoginPage, { hideGuestLogin: true });// <!-- 2.0 updates -->
    modal.present();
  }


  sendPhone() {
    this.isWaiting = true;
    (<any>window).FirebasePlugin.verifyPhoneNumber(`+974${this.phoneNumber}`, 60, (credential) => {
      console.log(credential);
      console.log('this.phoneNumber : ', this.phoneNumber);
      this.isWaiting = false
      let verificationModal = this.modalCtrl.create(PhoneVerificationPage, { phone: this.phoneNumber, verify_number: credential.verificationId })
      verificationModal.onDidDismiss(data => {
        console.log("my a7a data : ", data);
        if (data) {
          this.isPhoneVerified = data
        }
        console.log("is my phone verfied : ", this.isPhoneVerified);
      })
      verificationModal.present()
    }, (error) => {
      if (error == "Invalid phone number") {
        this.presentToast("رقم الهاتف خاطئ")
      }
      this.isWaiting = false
      console.error("my phone err : ", error);
    });
  }



  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



}
