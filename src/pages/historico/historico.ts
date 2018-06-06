import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  //fazer receber queries e adiciona-las na lista
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoricoPage');
  }

}
