import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { CheckerApi } from '../../shared/checker-api';
import { List } from '../../resources/List';
import { Query } from '../../resources/Query';
//import {EmailComposer} from '@ionic-native/email-composer';
//import {File} from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-show-list',
  templateUrl: 'show-list.html',
})
export class ShowListPage {
  
  private header: string;
  private subHeader: string;
  private list: List<Query>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public checkApi: CheckerApi) {
    this.header = this.navParams.get("header");
    this.subHeader = this.navParams.get("subheader");
    this.list = new List();
    this.list = this.navParams.get("list");    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowListPage');
  }

  
  ionViewWillLeave(){
    this.navCtrl.popToRoot();
  }

  private emailList(fab: FabContainer) {
    fab.close();
    console.log("Not supported");
  }

  checarInstituicao() {
    var DCE = "CorDCE";
    var XIX = "CorXIX";
    var DIR = "CorDIR";
    var ENG = "CorENG";
    var PPM = "CorPPM";
    var RI = "CorRI";
    var res
    switch (this.checkApi.getUserData().institution) {
      case "A.A.A. Adhemar F. da Silva": {
        res = RI;
        break;
      }
      case "A.A.A. PPM": {
        res = PPM;
        break;
      }
      case "A.A.A. XX de Março": {
        res = ENG;
        break;
      }
      case "A.A.A. XXVIII de Maio": {
        res = DIR;
        break;
      }
      case "A.A.A. XIX de Abril": {
        res = XIX;
        break;
      }
      case "DCE Celso Furtado": {
        res = DCE;
        break;
      }
    }
    return res;
  }
}
