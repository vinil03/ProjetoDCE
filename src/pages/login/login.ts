import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPage } from '../pages/camera/camera';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  loadCameraPage(){
    this.navCtrl.push(CameraPage);
  }

  sendMail() {
    window.open(`mailto:iago.regiani@dcefacamp.com`, '_system');
 }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  goToCamera(){
    this.navCtrl.push(TabsPage);
  }

}
