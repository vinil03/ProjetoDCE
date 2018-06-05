import { Component } from '@angular/core';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner) {

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'RA',
      message: "Digite o RA do Aluno",
      inputs: [
        {
          name: 'RA',
          placeholder: 'RA'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  launchReader(){
    this.options = {
      prompt: 'Passe o código de barras da carterinha',
      resultDisplayDuration: 500
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => { this.RA = Number (barcodeData.text.substring(2,11))}).catch(err => {
         console.log('Erro de leitura do barcode', err);
     });
  } 
}
