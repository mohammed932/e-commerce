import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase'
import { Observable, Subscription } from 'rxjs/Rx';


@Component({
  selector: 'page-phone-verification',
  templateUrl: 'phone-verification.html',
})
export class PhoneVerificationPage {
  phoneNumber: any
  code: any = '';
  sub: Subscription;
  isWaiting: boolean = false
  isShowCounter: boolean = false
  counter: any
  isWaiting2: boolean = false
  verificationId: any = '';
  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private ngZone: NgZone,

    public navParams: NavParams) {
    this.phoneNumber = this.navParams.get('phone')
    this.verificationId = this.navParams.get('verify_number')
    console.log('my this.phoneNumber : ', this.phoneNumber);
  }


  send() {
    this.isWaiting = true;
    let signinCreditional = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code)
    firebase.auth().signInWithCredential(signinCreditional).then(info => {
      console.log("verification info : ", info);
      if (info.I) {
        console.log("iam okay");
        this.viewCtrl.dismiss(true)
      }
      this.isWaiting = false;
    }, err => {
      this.isWaiting = false;
      if (err.code == 'auth/invalid-verification-code') {
        this.presentToast('رقم التحقق خاطئ حاول مره اخري')
        this.isShowCounter = true
        this.ngZone.run(() => { this.startTimer() })
      }
      console.log("verification error : ", err);
    })
  }

  startTimer() {
    let timer = Observable.interval(1000);
    this.sub = timer.subscribe(
      t => {
        this.counter = t
        console.log("my t : ", t);
        if (t == 60) {
          this.sub.unsubscribe()
          this.isShowCounter = false
        }
      }
    );
  }


  resend() {
    this.isWaiting2 = true;
    (<any>window).FirebasePlugin.verifyPhoneNumber(`+20-${this.phoneNumber}`, 60, (credential) => {
      console.log("my credential : ", credential);
      this.verificationId = credential.verificationId;
      this.isWaiting2 = false;
      this.isShowCounter = true
      this.ngZone.run(() => { this.startTimer() })
    }, (error) => {
      //this.eer = error;
      console.error('phone number error : ', error);
      this.presentToast(error)
      this.isWaiting2 = false;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss()
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
