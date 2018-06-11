import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CheckerApi } from '../../shared/checker-api';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  private loader: any;
  private loader2: any;
  private dataBase: {};
  private logo: any; //carregar com o logo da atlética do storage

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingController:
    LoadingController, private checkerApi: CheckerApi, public alertCtrl: AlertController, public platform: Platform) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
    this.loader = this.loadingController.create({ content: "Carregando...", duration: 20000 });
    this.loader.present().then(() => {
      this.checkerApi.getDataBase().then(apiData => {
        this.dataBase = apiData;
        console.log("Data loaded - Loader will be dismissed", apiData)
        this.loader.dismiss();
        this.showVersion();
      },
        
        error => {
          this.loader.dismiss();
          this.errorMsg();
        })
    });
  }

  showVersion() {
    this.loader2 = this.loadingController.create({//mensagem de aviso de sucesso
      spinner: 'hide',
      content: "Versão 28/05",
      //`<div class="custom-spinner-container">
      //  <div class="custom-spinner-box"></div>
      //  </div>`,
      duration: 2000,
    });
    this.loader2.present().then(() => {
      this.navCtrl.setRoot(TabsPage);
    });
  }


  errorMsg() {
    let alert = this.alertCtrl.create({
      title: 'Erro de conexão',
      subTitle: 'Não foi possível estabelecer conexão com o servidor remoto. Tente novamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.setRoot(LoginPage);
        }
      }]
    });
    alert.present();
  }
}
