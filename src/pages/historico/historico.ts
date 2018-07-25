import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, FabContainer } from 'ionic-angular';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';
import { CheckerApi } from '../../shared/checker-api';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, private checkerApi: CheckerApi, private loadingController: LoadingController, private toastCtrl: ToastController, private alertController: AlertController) {
    this.userData = this.navParams.get("UD");
    console.log("Nav params in hist: ", this.navParams.data);
    console.log("User data in hist: ", this.userData);
    this.query = new List();
  }
  //fazer receber queries e adiciona-las na lista - multilinelist
  ionViewDidLoad() {
    console.log('Query items[0]: ', this.query.getItem(0), "Query size: ", this.query.size());
    
    
   //s if(this.query.getItem(0)){ 
    this.hasQueryList = true; //só faz se tiver pelo menos um item 
   // }
  }

  ionViewWillEnter() {
    console.log('Will load');
    this.query = this.checkerApi.getTabData();
  }

  private upload(fab: FabContainer) {
    fab.close();
    this.loader = this.loadingController.create({ content: "Carregando..." });
    const toast = this.toastCtrl.create({
      message: 'Salvo com sucesso!',
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });      
    this.loader.present().then(() => {
      this.checkerApi.uploadSession(this.userData).then(() => { //Lembrar da session ID 
        this.loader.dismiss();
        toast.present();
      },
        error => {
          this.loader.dismiss();
          let alert = this.alertController.create({
            title: 'Erro',
            subTitle: 'Não foi possível salvar. Tente novamente mais tarde \n' + error,
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
}
