import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { CheckerApi } from '../../shared/checker-api';
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
  private list: any;
  private listName: Array<string>;
  private listRA: Array<string>;
  private listTime: Array<string>;
  private listCourse: Array<string>;
  private dataBase: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public checkApi: CheckerApi) {
    this.header = this.navParams.get("header");
    this.subHeader = this.navParams.get("subheader");
    this.list = this.navParams.get("list");
    this.listName = new Array<string>();
    this.listRA = new Array<string>();
    this.listTime = new Array<string>();
    this.listCourse = new Array<string>();
    this.dataBase  = this.checkApi.getDataBase();
    for(let i = 0; i<this.list.length;i=i+2){
      this.listRA.push(this.list[i]);
      this.listTime.push(this.list[i+1]);
      this.listName.push(this.returnName(this.list[i]));
      this.listCourse.push(this.returnCourse(this.list[i]));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowListPage');
  }

  
  ionViewWillLeave(){
    this.navCtrl.popToRoot();
  }

  private returnName(ra: string): string {
    for (var inst in this.dataBase) {
      // console.log("Inst:", inst);
      if (this.dataBase[inst][ra]) {
        return this.dataBase[inst][ra].NAME;
      }
    }
    return "Sem registro";
  }

  private returnCourse(ra: string): string {
    for (var inst in this.dataBase) {
      // console.log("Inst:", inst);
      if (this.dataBase[inst][ra]) {
        return this.dataBase[inst][ra].COURSE;
      }
    }
    return "";
  }

  private emailList(fab: FabContainer) {
    fab.close();
    console.log("Not supported");
  }
}
