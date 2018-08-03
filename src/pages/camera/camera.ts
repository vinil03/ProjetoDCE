import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HistoricoPage } from '../historico/historico';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { TabsPage } from '../tabs/tabs';
import { CheckerApi } from '../../shared/checker-api';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  private tab1Root = CameraPage;
  private tab2Root = HistoricoPage;
  private options: BarcodeScannerOptions;
  private queryCreated: boolean = false;
  private isAss: boolean = false;
  private query: Query = null;
  private dataBase: any;
  private name: any;
  private userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner, private checkApi: CheckerApi) {
    this.dataBase = this.checkApi.getDataBase();
    this.userData = this.checkApi.getUserData();
    let ID = new Date();
    this.checkApi.setSessionID(ID.getDate() + ":" + (ID.getMonth() + 1) + ":" + ID.getFullYear() + "-" + ID.getHours() + ":" + ID.getMinutes() + ":" + ID.getSeconds() + ":" + ID.getMilliseconds());
    console.log("Institution key from method: ",  this.checkApi.getInstitutionKey(this.userData.institution));
    //constroi a promise de sessão - timeout de 1h para envio ao firebase da querylist na api
    //this.initiateSession().then(data => {
      //faz upload para o firebase (promise).then(
      // fecha o app)
    //})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  launchReader() {

    this.options = {
      prompt: 'Passe o código de barras da carterinha',
      resultDisplayDuration: 0,
      preferFrontCamera: false,
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => {
      this.createQuery(this.organizeDate(new Date()), parseInt(barcodeData.text.substring(2, 11)));
      this.checkRA();
    }).catch(err => {
      console.log('Erro de leitura do barcode', err);
    });
  }

  checkRA() {    //faz a consulta no banco e popula a query list
    if (this.query != null) {
      //console.log("Query n nula", this.dataBase);
      var ra = this.query.getRA();
      for (var inst in this.dataBase) {
        // console.log("Inst:", inst);
        if (this.dataBase[inst][ra]) {
          var obj = this.dataBase[inst][ra];
          this.query.setName(obj.NAME);
          this.query.setCourse(obj.COURSE);
          this.isAss = true;
          this.checkApi.addTabData(this.query);
          return true;
        }
      }
      this.query.setName("Nome não registrado");
      this.isAss = false;
      this.checkApi.addTabData(this.query);
      return false;
    } else {
      console.log("Query nula");
    }
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'RA',
      message: "Digite o RA do Aluno",
      inputs: [
        {
          name: 'RA',
          placeholder: 'RA',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            var nun = data.RA;
            //console.log("nun: ", nun);
            //var txt = nun.replace(/\D+/g, "");
            //console.log("txt: ", txt);
            //console.log("Number: ", parseInt(txt));
            this.createQuery(this.organizeDate(new Date()), nun);
            //console.log('Buscar clicked: ', data.RA);
            this.checkRA();
            //console.log('Fechou ');
          }
        }
      ]
    });
    prompt.present();
  }

  organizeDate(d: Date) {
    let sec = d.getSeconds(), min = d.getMinutes(), h = d.getHours() ;
    let h2, min2, sec2;
    if (h < 10) {
      h2 = "0" + h;
    } else {
      h2 = h;
    }
    if (min < 10) {
      min2 = "0" + min;
    } else {
      min2 = min;
    }
    if (sec < 10) {
      sec2 = "0" + sec;
    } else {
      sec2 = sec;
    }
    return h + ":" + min2 + ":" + sec2;
  }

  createQuery(time: string, ra: number) { //o ideal seria checar o tamanho e caracteres indevidos, se tiver, nullar
    //console.log("Query created: ", ra);
    if (ra == null || ra < 200000000 || isNaN(ra) || ra > 205000000) {
      this.queryCreated = false;
      //this.query = null;
    } else {
      this.query = new Query(ra, time); // colocar nome do typer
      this.queryCreated = true;
    }
  }

  initiateSession() {
    return new Promise((resolve) => {

    });
  }

  checarInstituicao(){
    var DCE = "CorDCE";
    var XIX = "CorXIX";
    var DIR = "CorDIR";
    var ENG = "CorENG";
    var PPM = "CorPPM";
    var RI = "CorRI";
    var res
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
