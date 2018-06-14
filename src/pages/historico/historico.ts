import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPage } from '../camera/camera';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';
import { CheckerApi } from '../../shared/checker-api';


@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {

  query: List<Query>;
  hasQueryList = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public chkApi: CheckerApi) {    
    console.log('Will construct');
    this.query = new List();
  }
  //fazer receber queries e adiciona-las na lista
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoricoPage');
    console.log('Data query',this.query.getItem(0));
    this.hasQueryList = true;
  }

  ionViewWillEnter(){
    console.log('Will load');
    console.log('Data size',this.chkApi.getTabData().size());
    console.log('Data item',this.chkApi.getTabData().getItem(0));
    this.query = this.chkApi.getTabData();
  }
}
