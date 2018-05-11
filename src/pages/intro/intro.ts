import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CheckerApi } from '../../shared/checker-api';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Device } from '@ionic-native/device';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  private loader: any;
  private loader2: any;
  private dataBase: {};
  private DBversion: string;
  private userData: any;
  private deviceInfo: any = {
    uuid: "",
    model: "",
    manufacturer: ""
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingController: LoadingController, private checkerApi: CheckerApi,
    public alertCtrl: AlertController, public platform: Platform, private device: Device) {

    this.deviceInfo.uuid = this.device.uuid;
    this.deviceInfo.model = this.device.model;
    this.deviceInfo.manufacturer = this.device.manufacturer;
    //console.log("Object DeviceInfo is null?", this.deviceInfo == null);
    console.log("UID: ", this.device.uuid, "Modelo: ", this.device.model, "Fabricante: ", this.device.manufacturer)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
    this.UserIsVerified().then(data => {
      this.loadData();
    })
      .catch(error => {
        this.errorMsg(error);
      });
  }

  errorMsg(msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: msg,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.platform.exitApp();
        }
      }]
    });
    alert.present();
  }

  UserIsVerified() {
    return new Promise((resolve, reject) => {
      this.loader = this.loadingController.create({ content: "Verificando credencial..." });
      this.loader.present().then(() => {
        var uid = firebase.auth().currentUser.uid
        this.checkerApi.loadUserData(uid).then((userData: any) => {
          var isOkay = true;

          if (userData == null && isOkay) {
            isOkay = false;
            this.loader.dismiss();
            reject(new Error("Usuário com erro nos dados. Fale para o administrador verificar o banco"));
          } else {
            if (!firebase.auth().currentUser.emailVerified && isOkay) {
              isOkay = false;
              this.loader.dismiss();
              reject(new Error("Verifique o seu email para ativar a conta"));
            }
           /* if(false){
              isOkay = false;
              this.loader.dismiss();
              reject(new Error("Aplicativo desatualizado. Verifique por atualizações na sua app store"));
            }*/
            if (userData.verified == false && isOkay) {
              isOkay = false;
              this.loader.dismiss();
              reject(new Error("Usuário não autorizado. Entre em contato com o administrador"));
            }//Descomentar para testar celular
            //if (userData.deviceInfo != this.deviceInfo && userData.deviceInfo != "newDevice" && isOkay) {
            //  isOkay = false;
            //  this.loader.dismiss();
            //  reject(new Error("Dispositivo não autorizado. Entre em contato com o administrador"));
            //}
            if (userData.deviceInfo == "newDevice" && isOkay) { // troca de dispositivo - cadastra o novo
              this.checkerApi.updateDevice(uid, this.deviceInfo);
              console.log("New device registred");
            }
          }
          if (isOkay) {
            this.userData =  userData;
            this.loader.dismiss();
            resolve();
          }
        },
          error => {
            this.loader.dismiss();
            reject(new Error('Não foi possível estabelecer conexão com o servidor remoto. Tente novamente'));
          }
        )
      });
    });
  }

  loadData() {
    this.loader = this.loadingController.create({ content: "Carregando..." });
    this.loader.present().then(() => {
      console.log("Will get database");
      this.checkerApi.loadDataBase().then(apiData => {
        this.dataBase = apiData;
        console.log("Got database. Will get version");
        this.checkerApi.getBDVersion(this.userData.institution).then((version: string) => {
          this.DBversion = version;
          console.log("BD loaded - Loader will be dismissed", this.dataBase)
          this.loader.dismiss();
          this.showVersion();
        });
      });
    });

  }

  showVersion() {
    this.loader2 = this.loadingController.create({
      spinner: 'hide',
      content: '<div class="Img" id="Img"><img src="'+this.getImagePath()+'"/>'+this.DBversion+'</div>',
      duration: 1800,
    });
    this.loader2.present().then(() => {
      this.checkerApi.saveDataBase(this.dataBase);
      this.checkerApi.saveUserData(this.userData);
      this.navCtrl.setRoot(TabsPage);
    });
  }
  getImagePath() {
    var DCE = "assets/imgs/DCEcoloridoPNG.png";
    var XIX = "assets/imgs/Atleticas/ADM_ECO.png";
    var DIR = "assets/imgs/Atleticas/DIR.png";
    var ENG = "assets/imgs/Atleticas/ENG.png";
    var PPM = "assets/imgs/Atleticas/PPM.png";
    var RI = "assets/imgs/Atleticas/RI.png";
    var res = DCE;
    switch (this.userData.institution) {
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
