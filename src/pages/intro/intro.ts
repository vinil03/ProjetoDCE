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
  private userInstitution: any;
    uuid: "",
    model: "",
  };


  ionViewDidLoad() {
    //verificar se celInfo é diferente do que está no servidor
    // No primeiro login mandar para auth, depois verificar se é igual, se for pode chamar loadData, senão noAuthUser() 
    console.log('ionViewDidLoad IntroPage');
    this.UserIsVerified().then(data => {
      this.loadData();
    })


  }

    this.loader.present().then(() => {
          this.loader.dismiss();
          reject(new Error("Usuário com erro nos dados. Fale para o admisntrador verificar o banco"));
        }
        this.userInstitution = userData.institution;
        if(userData.verified==false && isOkay){
          isOkay = false;
          this.loader.dismiss();
      this.checkerApi.getDataBase().then(apiData => {
        this.dataBase = apiData;
        console.log("BD loaded - Loader will be dismissed", this.dataBase)
        this.loader.dismiss();
        this.showVersion();
      })
    });
  }

loadData() {
  this.loader = this.loadingController.create({ content: "Carregando..." });
  this.loader.present().then(() => {
    this.checkerApi.getDataBase().then(apiData => {
      this.dataBase = apiData;
      console.log("BD loaded - Loader will be dismissed", this.dataBase)
      this.loader.dismiss();
      this.showVersion();
    })
  });
}

showVersion() {  
  this.loader2 = this.loadingController.create({
    spinner: 'hide',
    content: '<div class="Img"> <img src="' + this.getImagePath() + '" /> </div> <div class="ver">' + this.checkerApi.getBDVersion(null) + '</div>', //corrigir
    duration: 1800,
  });
  this.loader2.present().then(() => {
    // start session counter  - IMPLEMENTAR
    this.navCtrl.setRoot(TabsPage, this.dataBase); //passar os dados do usário
  });
}
}
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