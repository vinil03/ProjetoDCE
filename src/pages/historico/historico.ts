import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, FabContainer } from 'ionic-angular';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';
import { CheckerApi } from '../../shared/checker-api';
import { Subject } from 'rxjs/subject';
import { Observable } from 'rxjs/Rx';
//import {EmailComposer} from '@ionic-native/email-composer';
//import {File} from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {

  private query: List<Query>;
  private hasQueryList = false;
  private userData: any;
  private loader: any;
  private refreshSubject: Subject<void>;
  private refreshObservable: Observable<void>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private checkerApi: CheckerApi, private loadingController: LoadingController, private toastCtrl: ToastController, private alertController: AlertController) {
    this.userData = this.checkerApi.getUserData();
    //console.log("Nav params in hist: ", this.navParams.data);
    //console.log("User data in hist: ", this.userData);
    this.query = new List();
    this.refreshSubject = new Subject<void>();
    this.refreshObservable = this.refreshSubject.asObservable();
  }
  //fazer receber queries e adiciona-las na lista - multilinelist
  ionViewDidLoad() {
    //console.log('Query items[0]: ', this.query.getItem(0), "Query size: ", this.query.size());
    //s if(this.query.getItem(0)){ 
    this.hasQueryList = true; //só faz se tiver pelo menos um item 
    // }
  }

  ionViewWillEnter() {
    console.log('Will load');
    this.query = this.checkerApi.getTabData();
    console.log("query list size: (entering)", this.query.size());
  }

  private showAC(fab: FabContainer) {
    let ID = "";
    console.log("Alert Controller");
    fab.close();
    let alert = this.alertController.create({
      title: 'ID',
      subTitle: 'Digite um ID. Pode ser utilizado para compartilhar os dados ou somente para referência',
      inputs: [
        {
          name: 'ID',
          placeholder: 'Opcional',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: data => {
            ID = data.ID;
            this.upload(ID);
          }
        }]
    });
    alert.present();
  }

  private upload(ID: string){
    this.loader = this.loadingController.create({ content: "Carregando..." });
    const toast = this.toastCtrl.create({
      message: 'Salvo com sucesso!',
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    this.loader.present().then(() => {
      console.log("User data: ", this.userData);
      this.checkerApi.uploadSession(this.userData, ID).then(() => {
        this.loader.dismiss();
        console.log("query list size (end): ", this.query.size());
        this.refreshSubject.next(); //http://www.damirscorner.com/blog/posts/20170602-AutoRefreshWithManualOverride.html
        //this.hasQueryList =  false;
        toast.present();
      },
        error => {
          this.loader.dismiss();
          let alert = this.alertController.create({
            title: 'Erro',
            subTitle: 'Não foi possível salvar. Tente novamente mais tarde \n\n' + error,
            buttons: [{
              text: 'OK'
            }]
          });
          alert.present();
        }
      );
    });

  }

  private search(fab: FabContainer) {    //usar datetime e calendário
    fab.close();
    if (this.userData.institution == "DCE" || this.userData.searchAuth == true) {
      //mostrar calendário para realizar busca.
      // Se autorizado, pode incluir outras instituiçoes por um tempo que deve ser buscado do firebase - fazer exceção para DCE
    } else {
      //busca padrão nos users da msm isntituição
    }
  }

  checarInstituicao(){
    var DCE = "DCE";
    var XIX = "XIX";
    var DIR = "DIR";
    var ENG = "ENG";
    var PPM = "PPM";
    var RI = "RI";
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
