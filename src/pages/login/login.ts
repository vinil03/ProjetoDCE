import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CameraPage } from '../camera/camera';
import { IntroPage } from '../intro/intro';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  verifyUser(){ //substistuir por verificar login
    this.navCtrl.setRoot(IntroPage);
  }

  sendMail() { //criar uma página de cadastro
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
