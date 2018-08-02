import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, FabContainer } from 'ionic-angular';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';
import { CheckerApi } from '../../shared/checker-api';
import { Subject } from 'rxjs/subject';
import { Observable } from 'rxjs/Rx';
import { ShowListPage } from '../show-list/show-list';
//import { DatePicker } from '@ionic-native/date-picker';

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
    //só faz se tiver pelo menos um item 
    // }
  }

  ionViewWillEnter() {
    //console.log('Will load');
    this.hasQueryList = true;
    this.query = this.checkerApi.getTabData();
    //console.log("query list size: (entering)", this.query.size());
  }

  private showLoadAC(fab: FabContainer) {
    let ID = "";
    //console.log("Alert Controller");
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

  private upload(ID: string) {
    this.loader = this.loadingController.create({ content: "Carregando..." });
    const toast = this.toastCtrl.create({
      message: 'Salvo com sucesso!',
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    this.loader.present().then(() => {
      //console.log("User data: ", this.userData);
      this.checkerApi.uploadSession(this.userData, ID).then(() => {
        this.loader.dismiss();
        //fazer autoRefresh
        // console.log("query list size (end): ", this.query.size()); 
        //this.refreshSubject.next(); //http://www.damirscorner.com/blog/posts/20170602-AutoRefreshWithManualOverride.html

        this.hasQueryList = false;
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

  private search(ID: string) {    //usar datetime e calendário
    //verifica de ID é maior que 0
    // se for vê se é válido, e se for retorna os dados para enviar para a próxima página
    // se não, fala ID não encontrado
    // se o ID for vazio, abrir calendário
    this.loader = this.loadingController.create({ content: "Carregando..." });
    if (ID == "") {
      //datepicker
      this.loader.present().then(() => {

      });
    } else {
      let hasKey = false;
      let keyFound, userFound;      
      this.loader.present().then(() => {
        this.checkerApi.getSessionIndex().then(index => {
          //fazer buscar a inst
          console.log("Index: ", index);
          for (var inst in index) {
            console.log("Inst: ", inst);
            for (var key in index[inst]) {
              console.log("Key: ", key);
              if (index[inst][key].ID == ID) {
                //console.log("Key Found: ", key);
                keyFound = key;
                userFound = index[inst][key].user;
                hasKey = true;
              }
            }
          }
          if (hasKey) {
            this.pushConsultedList(userFound, keyFound);
          } else {
            const toast = this.toastCtrl.create({
              message: 'ID não encontrado!',
              duration: 2000,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            //this.loader.dismiss();
            toast.present();
          }
        },
          error => {
            const toast = this.toastCtrl.create({
              message: error,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            this.loader.dismiss();
            toast.present();
          }
        );
      });
    }


    /* ---Função descontinuada ---
    if (this.userData.institution == "DCE" || this.userData.searchAuth == true) {
      //mostrar calendário para realizar busca.
      // Se autorizado, pode incluir outras instituiçoes por um tempo que deve ser buscado do firebase - fazer exceção para DCE
    } else {
      //busca padrão nos users da msm isntituição
    } 
    */
  }
  private pushConsultedList(userName: string, sessionKey: string) {
    this.checkerApi.getSessionDataByKey(sessionKey).then(data => {
        console.log("Data donwloaded: ", data);

        this.navCtrl.push(ShowListPage);
    },
      error => {
        const toast = this.toastCtrl.create({
          message: error,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        this.loader.dismiss();
        toast.present();
      }
    );

    this.loader.dismiss();
  }

  private showSearchAC(fab: FabContainer) {
    let ID = "";
    //console.log("Alert Controller");
    fab.close();
    let alert = this.alertController.create({
      title: 'ID',
      subTitle: 'Caso tenha, digite um ID para buscar',
      inputs: [
        {
          name: 'ID',
          placeholder: 'Se não tiver, clique em continuar',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: data => {
            ID = data.ID;
            this.search(ID);
          }
        }]
    });
    alert.present();
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
