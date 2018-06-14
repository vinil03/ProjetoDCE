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
  private query: Query = null;
  private database: any;
  private name: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              private barcodeScanner: BarcodeScanner, private checkApi: CheckerApi) {
    this.database = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
    //console.log("Database: ", this.database[0]);
    var q = new Query(200,"time","name");
    this.checkApi.addTabData(q);
    console.log("Q ADDED");
  }

  launchReader() {

    this.options = {
      prompt: 'Passe o código de barras da carterinha',
      resultDisplayDuration: 0,
      preferFrontCamera: false,
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => {
      this.createQuery(this.organizeDate(new Date()), parseInt(barcodeData.text.substring(2, 11)));
    }).catch(err => {
      console.log('Erro de leitura do barcode', err);
    });

  }

  checkRA(){    //faz a consulta no banco e popula a query list
    var index = null;
    //console.log("Objeto: ", JSON.stringify(this.query));
    var ra = this.query.getRA();
    //console.log("RA recebido: ", ra);
    //console.log("Tamanho:", this.database.length);
    for (var i = 0; i < this.database.length; i++) {
      console.log("Database i", i, "Valor: ", this.database[i].RA, "com RA: ", ra );
      if (this.database[i].RA == ra) {
        index = i;
      }
    }
    if (index == null) {
      this.query.setName("Não registrado");
      this.checkApi.addTabData(this.query);
      // this.name= "Não registrado";
      // name:this.name;
      // ({
      //   name: "Não registrado"
      // })
      return false;
    } else {
      this.query.setName(this.database[index].NAME);
      this.checkApi.addTabData(this.query);
      // this.name=this.query;
      
      return true;
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
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buscar',
          handler: data => {
            this.createQuery(this.organizeDate(new Date()), parseInt(data.RA));//o ideal seria checar o tamanho e caracteres indevidos
            console.log('Buscar clicked: ');
          }
        }
      ]
    });
    prompt.present();
  }

  organizeDate(d: Date) { //CORRIGIR O MÊS!!!!
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "|" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  }

  createQuery(time: string, ra: number) {
    if (ra == null) {
      this.queryCreated = false;
    } else {
      this.query = new Query(ra, time, "someone"); // colocar nome do typer
      this.queryCreated = true;
    }
  }
}
