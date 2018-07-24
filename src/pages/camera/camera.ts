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
    this.dataBase = this.navParams.get("DB");
    this.userData = this.navParams.get("UD");
    console.log("User data: ", JSON.stringify(this.userData));
    //constroi a promise de sessão - timeout de 1h para envio ao firebase da querylist na api
    this.initiateSession().then(data => {
      //faz upload para o firebase (promise).then(
      // fecha o app)
    })
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
      console.log("Query n nula", this.dataBase);
      var ra = this.query.getRA();
      // l1:
      for (var inst in this.dataBase) {
        // console.log("Inst:", inst);
        console.log("if: ", this.dataBase[inst][ra]);
        if (this.dataBase[inst][ra]) {
          var obj = this.dataBase[inst][ra];
          this.query.setName(obj.NAME);
          this.query.setCourse(obj.COURSE);
          this.isAss = true;
          this.checkApi.addTabData(this.query);
          return true;
        }
      }
      this.query.setName("Não registrado");
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

  organizeDate(d: Date) { //CORRIGIR O MÊS!!!!
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "|" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  }

  createQuery(time: string, ra: number) { //o ideal seria checar o tamanho e caracteres indevidos, se tiver, nullar
    //console.log("Query created: ", ra);
    if (ra == null || ra < 200000000 || isNaN(ra) || ra > 205000000) {
      this.queryCreated = false;
      //this.query = null;
    } else {
      this.query = new Query(ra, time, "someone"); // colocar nome do typer
      this.queryCreated = true;
    }
  }

  initiateSession() {
    return new Promise((resolve) => {

    });
  }
}
