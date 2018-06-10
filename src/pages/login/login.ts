import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CameraPage } from '../camera/camera';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  loadCameraPage(){
    this.navCtrl.setRoot(CameraPage);
  }

  sendMail() {
    window.open('mailto:iago.regiani@dcefacamp.com', '_system');
 }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  sendLogin(){

  }

  sendPassword(){

  }
  
}
