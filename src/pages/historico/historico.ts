import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPage } from '../camera/camera';
import { Query } from '../../shared/Query';
import { List } from '../../shared/List';


@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {

  query: List<Query>;
  //query = queries.getNAme();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.query = this.navParams.data.items;
    console.log("Queries: ",this.query);
  }
  //fazer receber queries e adiciona-las na lista
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoricoPage');
  }

  //PRECISA TESTAR
  // getScan(){
  //   this.navCtrl.push(query.arguments);
  // }

}
