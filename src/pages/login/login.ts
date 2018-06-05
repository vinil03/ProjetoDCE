import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
<<<<<<< HEAD
import { CameraPage } from '../pages/camera/camera';
=======
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
>>>>>>> ae52c452eea59c88f3d13e58bb6ac3e34249a1d4

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
