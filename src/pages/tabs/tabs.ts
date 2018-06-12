import { Component } from '@angular/core';

import { CameraPage } from '../camera/camera';
import { HistoricoPage } from '../historico/historico';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { query } from '@angular/core/src/animation/dsl';
//import { query } from '@angular/core/src/render3';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CameraPage;
  tab2Root = HistoricoPage;
  tab1Params: any;
  queries:any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.tab1Params = this.navParams.data;
    console.log("tab1ParamsSize: ", this.navParams.data.length);
    console.log("tab1Params: ", this.tab1Params[0]);
  }

  getLista(){
      return this.queries;
  }

}