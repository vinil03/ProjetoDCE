import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CheckerApi } from '../../shared/checker-api';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  private loader: any;
  private loader2: any;
  private dataBase: {};
  private userInfo: {
    name: "";
    inst: "";  //pertence a qual atletica?
    level: 0; //definir se é admin ou só reader | 0 = reader
  };
  private celInfo: { //desassociar do usuário para poder efetuar a troca
    uuid: "",
    model: "",
    manufacturer: "",
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingController:
    LoadingController, private checkerApi: CheckerApi, public alertCtrl: AlertController, public platform: Platform,
    private device: Device) {
      //this.celInfo.uuid=this.device.uuid;
      //this.celInfo.model=this.device.model;
      //this.celInfo.manufacturer=this.device.manufacturer;
      console.log("UID: ", this.device.uuid, "Modelo: ", this.device.model, "Fabricante: ", this.device.manufacturer) 
  }

  ionViewDidLoad() {
    //verificar se celInfo é diferente do que está no servidor
    // No primeiro login mandar para auth, depois verificar se é igual, se for pode chamar loadData, senão noAuthUser() 
    console.log('ionViewDidLoad IntroPage');
    this.loadData();
    
  }

  loadData(){
    this.loader = this.loadingController.create({ content: "Carregando..."});
    this.loader.present().then(() => {
      this.checkerApi.getDataBase().then(apiData => {
        this.dataBase = apiData;
        console.log("Data loaded - Loader will be dismissed", apiData)
        this.loader.dismiss();
        this.showVersion();
      },         
        error => { //O ideal vai ser usar uma versão menos atualizada dos dados locais
          this.loader.dismiss();
          this.errorMsg();
        })
    });
  }

  showVersion() {
    var version = "BD: 28/05";
    var imagePath = "assets/imgs/DCEcoloridoPNG.png"; //mensagem de aviso de sucesso - colocar o logo de cada atlética
    this.loader2 = this.loadingController.create({
      spinner: 'hide',
      content: '<div class="Img" id="Img"> <img src="'+imagePath+'" /> </div> <div class="ver" id="ver">'+version+'</div>',
      duration: 1800,
    });
    this.loader2.present().then(() => {
      this.navCtrl.setRoot(TabsPage, this.dataBase);
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

  noAuthUser(){
    //pegar dados do usuário sem cadastro e mandar para avaliação
  }
}
