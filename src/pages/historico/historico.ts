import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, FabContainer } from 'ionic-angular';
import { Query } from '../../resources/Query';
import { List } from '../../resources/List';
import { CheckerApi } from '../../shared/checker-api';
import { ShowListPage } from '../show-list/show-list';
import { DatePicker } from '@ionic-native/date-picker';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private checkerApi: CheckerApi, private loadingController: LoadingController, private toastCtrl: ToastController, private alertController: AlertController, private datePicker: DatePicker, public authProvider: AuthProvider) {
    this.userData = this.checkerApi.getUserData();
    //console.log("Nav params in hist: ", this.navParams.data);
    //console.log("User data in hist: ", this.userData);
    this.query = new List();
    //this.refreshSubject = new Subject<void>();
    //this.refreshObservable = this.refreshSubject.asObservable();
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

  private search(ID: string) { //Se o ID não for informado, abre o calendário para o usuário escolher um dia
    this.loader = this.loadingController.create({ content: "Carregando..." });
    if (ID == "") {
      let message = "";
      this.datePicker.show({
        date: new Date(),
        is24Hour: true,
        mode: 'date'
      }).then(
        datePicked => {
          if (datePicked == null) {
            this.abort();
          } else {
            this.loader.present().then(() => {
              let date = datePicked.getDate() + ":" + (datePicked.getMonth() + 1) + ":" + datePicked.getFullYear();
              let date2 = datePicked.getDate() + "/" + (datePicked.getMonth() + 1) + "/" + datePicked.getFullYear();
              //this.pushConsultedList(userFound, keyFound, "");
              let hasKey = false;
              let keyFound = new Array<string>();
              this.checkerApi.getSessionIndex().then(index => {

                let indexInst = index[this.checkerApi.getInstitutionKey(this.userData.institution)];
                for (let i in indexInst) {
                  if (i.split("-")[0] == date) {
                    keyFound.push(i);
                  }
                }
                if (keyFound.length > 0) {
                  if (keyFound.length == 1) {
                    this.pushConsultedList(this.userData.name, keyFound[0], "");
                  } else {
                    let alert = this.alertController.create({
                      title: 'Há várias sessões armazenadas nesse dia',
                      message: 'Escolha qual deseja visualizar',
                      buttons: [
                        {
                          text: 'Cancelar',
                          role: 'cancel',
                          handler: data => {
                            this.abort();
                          }
                        },
                        {
                          text: 'Ir',
                          handler: data => {
                            this.pushConsultedList(this.userData.name, data, "");
                          }
                        }
                      ]
                    });
                    for (let i = 0; i < keyFound.length; i++) {
                      let dk = keyFound[i].split("-");
                      let dta = dk[1].split(":");
                      if (dta[0].length == 1) {
                        dta[0] = "0" + dta[0];
                      }
                      if (dta[1].length == 1) {
                        dta[1] = "0" + dta[1];
                      }
                      let label = dta[0] + ":" + dta[1];
                      alert.addInput({
                        type: 'radio',
                        label: label,
                        value: keyFound[i]
                      });
                    }
                    alert.present();

                  }
                } else {
                  const toast = this.toastCtrl.create({
                    message: "Não há sessões gravadas em " + date2,
                    duration: 2000,
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                  });
                  this.loader.dismiss();
                  toast.present();
                }
              });
            });
          }
        },
        error => {
          this.abort();
        });
    } else {
      let hasKey = false;
      let keyFound = new Array<string>();
      let userFound = new Array<string>();
      this.loader.present().then(() => {
        this.checkerApi.getSessionIndex().then(index => {
          //fazer buscar a inst
          //console.log("Index: ", index);
          for (var inst in index) {
            //console.log("Inst: ", inst);
            for (var key in index[inst]) {
              //console.log("Key: ", key);
              if (index[inst][key].ID == ID) {
                //console.log("Key Found: ", keygfd
                //keyFound = key;
                keyFound.push(key);
                userFound.push(index[inst][key].user);
                //userFound = index[inst][key].user;
                hasKey = true;
              }
            }
          }
          if (hasKey) {
            let user = userFound[0];
            let key = keyFound[0];
            if (userFound.length > 1) {
              let alert = this.alertController.create({
                title: 'Múltiplos IDs encontrados!',
                subTitle: ID,
                message: 'Escolha de qual usuário deseja visualizar',
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: data => {
                      this.abort();
                    }
                  },
                  {
                    text: 'Ir',
                    handler: data => {
                      this.pushConsultedList(userFound[data], keyFound[data], ID);
                    }
                  }
                ]
              });
              for (let i = 0; i < userFound.length; i++) {
                alert.addInput({
                  type: 'radio',
                  value: i + "",
                  label: userFound[i]
                });
              }
              alert.present();
            } else {
              this.pushConsultedList(user, key, ID);
            }

          } else {
            const toast = this.toastCtrl.create({
              message: 'ID não encontrado!',
              duration: 2000,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            this.loader.dismiss();
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
  }

  private abort() {
    console.log("Cancelled");
  }

  private pushConsultedList(userName: string, sessionKey: string, ID: string) {
    let dk = sessionKey.split("-");
    let dta = dk[0].split(":");
    if (dta[0].length == 1) {
      dta[0] = "0" + dta[0];
    }
    if (dta[1].length == 1) {
      dta[1] = "0" + dta[1];
    }
    let subHeader = "Usuário: " + userName + " Data: " + dta[0] + "/" + dta[1] + "/" + dta[2];
    let header = "Sessão Arquivada";
    console.log("ID:", ID);
    if (ID != "") {
      header += " - " + ID;
    }
    this.checkerApi.getSessionDataByKey(sessionKey).then(data => {
      console.log("Data downloaded: ", data);
      let primalList = new Array<string>();
      let list = new List();
      for (let val in data) {
        primalList.push(data[val]);
      }
      for (let i = 0; i < primalList.length; i = i + 2) {
        let q = new Query(parseInt(primalList[i]), primalList[i + 1]);
        q.setCourse(this.returnCourse(primalList[i]));
        q.setName(this.returnName(primalList[i]));
        list.add(q);
      }
      console.log("List: ", list);
      this.navCtrl.push(ShowListPage, { list: list, header: header, subheader: subHeader });

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

  checarInstituicao() {
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

  private returnName(ra: string): string {
    let dataBase = this.checkerApi.getDataBase();
    for (var inst in dataBase) {
      // console.log("Inst:", inst);
      if (dataBase[inst][ra]) {
        return dataBase[inst][ra].NAME;
      }
    }
    return "Sem registro";
  }

  private returnCourse(ra: string): string {
    let dataBase = this.checkerApi.getDataBase();
    for (var inst in dataBase) {
      // console.log("Inst:", inst);
      if (dataBase[inst][ra]) {
        return dataBase[inst][ra].COURSE;
      }
    }
    return "";
  }

  private logout(fab: FabContainer) {
    fab.close();
    console.log("Logout");
    this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }



}
