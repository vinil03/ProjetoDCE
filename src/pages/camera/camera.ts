import { Component, Query } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HistoricoPage } from '../historico/historico';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  tab1Root = CameraPage;
  tab2Root = HistoricoPage;
  options: BarcodeScannerOptions;
  RA: Number;
  query = {
    name: <string> null,
    RA: <Number> null,
    time: <string> null,
    evtName: <string> null,
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner) {
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  launchReader(){
    
    this.query.time = this.organizeDate(new Date());
    this.options = {
      prompt: 'Passe o código de barras da carterinha',
      resultDisplayDuration: 500
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => { 
      this.RA = parseInt (barcodeData.text.substring(2,11))
      }).catch(err => {
      console.log('Erro de leitura do barcode', err);
     });
    }
  
  checkRA():boolean{
    this.query.RA = this.RA;
    //this.query.evtName Pegar da tela anterior, e posterior ao login
    //this.query.name Se existir pegar do banco, senão, colocar "não registrado". ATTENÇÃO: fazer substring para um tamanho max
    
      //faz a consulta no banco e popula a query
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
            this.RA = parseInt (data.RA),
            this.query.time = this.organizeDate(new Date()),
            console.log('Buscar clicked: ');
           }
        }
      ]
    });
    prompt.present();
  }

  organizeDate(d : Date){ //CORRIGIR O MÊS!!!!
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() +  "|" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  }
}
