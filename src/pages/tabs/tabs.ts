import { Component } from '@angular/core';
import { CameraPage } from '../camera/camera';
import { HistoricoPage } from '../historico/historico';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CameraPage;
  tab2Root = HistoricoPage;
  tab1Params: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1Params = this.navParams.data;
  }
}