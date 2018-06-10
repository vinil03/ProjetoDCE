import { Component } from '@angular/core';

import { CameraPage } from '../camera/camera';
import { HistoricoPage } from '../historico/historico';
import { AlertController, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  nav: any;
  tab1Root = CameraPage;
  tab2Root = HistoricoPage;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController) {
  }

}