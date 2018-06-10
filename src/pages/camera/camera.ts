import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HistoricoPage } from '../historico/historico';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  tab1Root = CameraPage;
  tab2Root = HistoricoPage;
  options: BarcodeScannerOptions;
  queries: List<Query>;
  queryCreated: boolean = false;
  query: Query = null;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  launchReader() {

    this.options = {
      prompt: 'Passe o código de barras da carterinha',
      resultDisplayDuration: 0,
      preferFrontCamera: true,
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => {
      this.createEntry(this.organizeDate(new Date()), parseInt(barcodeData.text.substring(2, 11)));
    }).catch(err => {
      console.log('Erro de leitura do barcode', err);
    });

  }

  checkRA(): boolean {



    //this.query.name Se existir pegar do banco, senão, colocar "não registrado".
    this.query.setName("nome aluno");
    //this.queries.add(this.query);
    //faz a consulta no banco e popula a query list
    return true;

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
            this.createEntry(this.organizeDate(new Date()), parseInt(data.RA));//o ideal seria checar o tamanho e caracteres indevidos
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

  createEntry(time: string, ra: number) {
    if (ra == null) {
      this.queryCreated = false;
    } else {
      this.query = new Query(ra, time, "someone"); // colocar nome do typer
      this.queryCreated = true;
    }
  }

}
//POSSIVELMENTE TERÁ QUE SER INJETADO
class Query {
  private name: string;
  private RA: number;
  private time: string;
  private typer: string;
  constructor(ra: number, time: string, name: string) {
    this.RA = ra;
    this.time = time;
    this.typer = name;
  }
  setName(n: string) {
    if (n.length > 20) {
      this.name = n.substring(0, 20);
    } else {
      this.name = n;
    }
  }
  getRA() {
    return this.RA;
  }
  getName() {
    return this.name;
  }
  getTime() {
    return this.time;
  }
  getTyper() {
    return this.typer;
  }
}

class List<T> {
  private items: Array<T>;

  constructor() {
    this.items = [];
  }

  size(): number {
    return this.items.length;
  }

  add(value: T): void {
    this.items.push(value);
  }

  get(index: number): T {
    return this.items[index];
  }
}
