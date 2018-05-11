import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/timeout';
import { List } from '../resources/List';
import { Query } from '../resources/Query';
import firebase from '../../node_modules/firebase';

@Injectable()

export class CheckerApi {
    private baseUrl = 'https://dcechecker.firebaseio.com';
    private tabData: List<Query>;
    private sessionID: any;
    private instData: any;
    private userData: any;
    private dataBase: any;

    constructor(private http: Http) {
        this.tabData = new List();
    }

    loadDataBase() {
        return new Promise((resolve) => {
            firebase.database().ref("/associates/").once("value").then((data) => {
            //this.http.get(`${this.baseUrl}/associates.json`).subscribe((data) => {
                //resolve(data.json());
                resolve(data.toJSON());
             });
        });
    }

    loadUserData(uid: string) {
        return new Promise((resolve, reject) => {
            //console.log("UID: ", uid );
            firebase.database().ref("/userProfile/"+uid).once("value").then((data) => { // TIMEOUT?? //https://stackoverflow.com/questions/24885500/setting-timeout-on-once-in-firebase
            //this.http.get(`${this.baseUrl}/userProfile/` + uid + `/.json`).timeout(20000).subscribe((data) => {
                //console.log("PromiseUserData: ", data.toJSON())
                resolve(data.toJSON());
                //resolve(data.json());
            }, error => { reject() });
        });
    }

    updateDevice(uid: string, deviceInfo: any) {
        firebase.database().ref('/userProfile/' + uid + '/deviceInfo/').set(deviceInfo);
        console.log("Device updated!")
    }

    getTabData() {
        return this.tabData;
    }

    addTabData(q: Query) {
        this.tabData.add(q);
    }

    getBDVersion(inst: string) {
        return new Promise((resolve) => {
            firebase.database().ref("/institutions/").once("value").then((data) => {
            //this.http.get(`${this.baseUrl}/institutions.json`).subscribe((data: any) => {
                //this.instData = data.json();
                this.instData = data.toJSON();
                for (let key in this.instData) {
                    if (this.instData[key].Name == inst) {
                        resolve(this.instData[key].DBVersion);
                    }
                }
            });
        });
    }

    getInstitutionKey(inst: string): string {  //deveria trocar para os nomes poderem ser trocados no banco
        let res = "";
        switch (this.userData.institution) {
            case "A.A.A. Adhemar F. da Silva": {
                res = "RI-ECORI";
                break;
            }
            case "A.A.A. PPM": {
                res = "PPM";
                break;
            }
            case "A.A.A. XX de Março": {
                res = "ENG";
                break;
            }
            case "A.A.A. XXVIII de Maio": {
                res = "DIR";
                break;
            }
            case "A.A.A. XIX de Abril": {
                res = "ADM-ECO";
                break;
            }
            case "DCE Celso Furtado": {
                res = "DCE";
                break;
            }
        }
        return res;
        /* console.log("Inst received:", inst);
         console.log("InstData: ", this.instData);
 
         for (let i=0; i < this.instData.lengh; i++) {
             console.log("Inst Name:",this.instData[i].Name, "Instname = inst ", this.instData[i].Name == inst);
             if (this.instData[i].Name == inst) {
                 return i;                
             }
         } */
    }

    setSessionID(id: any) {
        this.sessionID = id;
    }

    uploadSession(userInfo: any, shareID: string) {
        //if (this.tabData.size() > 0) {
            let sessionData: Array<string>;
            sessionData = [];
            //this.tabData = new List();
            console.log("QueryList: ", this.tabData);
            //console.log("QueryListSize: ", this.tabData.size());
            for (let i = 0; i < this.tabData.size(); i++) { // separa todos os RAs que n possuem repetição já em sessionData
                console.log("Entrou no loop");
                let q = this.tabData.getItem(i);
                //console.log("RA ", q.getRA(), "is unique? ", this.tabData.isUnique(q));
                sessionData.push(q.getRA()+"");
                sessionData.push(q.getTime());   
            }
            console.log("Session data: ", sessionData);
            /*for (let i = 0; i < multiple_queries.size(); i++) {
                let RA_queries: List<Query>;
                RA_queries = new List();
                let q = multiple_queries.shift();
                if (q.getRA() != 0) {
                    RA_queries.add(q);
                }
                for (let l = i+1; l < multiple_queries.size(); l++) { //l= i+1?
                    if (q.getRA() == multiple_queries[i].getRA()) {
                        if (multiple_queries[i].getRA() != 0) {
                            RA_queries.add(multiple_queries[i]);
                        }
                        multiple_queries[i] = new Query(0, null);
                    }
                }
                let txt = this.queryArrayToString(RA_queries);
                sessionData.push(txt); 
            }*/
            //sessionData[sessionData.length - 1] = sessionData[sessionData.length - 1].substr(0, sessionData.lastIndexOf(",") - 1);
            console.log("*************SessionData to be uploaded: ");
            console.log(sessionData);
            return new Promise((resolve, reject) => {
                if(!(this.tabData.size() > 0)){
                    reject("**Não há dados para upload!**");
                }
                firebase.database().ref('/sessions/sessionData/' + this.sessionID).set(
                    sessionData
                ).then(() => {
                    firebase.database().ref('/sessions/index/'  + this.getInstitutionKey(userInfo.institution) + '/'+ this.sessionID).set({
                        "ID": shareID,
                        //"institution": this.getInstitutionKey(userInfo.institution),
                        //"institution": userInfo.institution,
                        "user": userInfo.name
                    }).then(() => {
                        let ID = new Date();
                        this.setSessionID(ID.getDate() + ":" + (ID.getMonth() + 1) + ":" + ID.getFullYear() + "-" + ID.getHours() + ":" + ID.getMinutes() + ":" + ID.getSeconds() + ":" + ID.getMilliseconds());
                        //this.tabData.clear();
                        this.tabData = new List();
                        resolve();
                    },
                        error => reject(error));
                },
                    error => reject(error)); // fazer timeout
            });
        //}else{
        //    return reject("Não há dados");
        //}
    }

    getSessionIndex(){
        return new Promise((resolve, reject) => {
            firebase.database().ref('/sessions/index/').once("value").then((data) => {
                resolve(data.toJSON());           
            },
                error => reject(error));
        });
    }

    getSessionDataByKey(key: string){
        return new Promise((resolve, reject) => {
            firebase.database().ref('/sessions/sessionData/'+ key).once("value").then((data) => {
                resolve(data.toJSON());           
            },
                error => reject(error));
        });
    }

    saveDataBase(db: any) {
        this.dataBase = db;
    }

    saveUserData(ud: any) {
        this.userData = ud;
    }

    getDataBase() {
        return this.dataBase;
    }

    getUserData() {
        return this.userData;
    }

    private queryArrayToString(list: List<Query>) {
        let res = '"' + list[0].getRA() + '":';
        for (let i = 0; i < list.size(); i++) {
            res += '"' + list[i].getTime() + ','
        }
        res = res.substr(0, res.lastIndexOf(",") - 1);
        res += '"';
        return res;
    }
}
