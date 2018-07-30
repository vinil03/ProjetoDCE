import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/timeout';
import { List } from '../resources/List';
import { Query } from '../resources/Query';
import firebase from '../../node_modules/firebase';
import { query } from '../../node_modules/@angular/core/src/animation/dsl';

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
            this.http.get(`${this.baseUrl}/associates.json`).subscribe((data) => {
                resolve(data.json());
                console.log("Fez database");
            });
        });
    }

    loadUserData(uid: string) {
        return new Promise((resolve, reject) => {
            //console.log("UID: ", uid );
            this.http.get(`${this.baseUrl}/userProfile/` + uid + `/.json`).timeout(20000).subscribe((data) => {
                resolve(data.json());
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
            this.http.get(`${this.baseUrl}/institutions.json`).subscribe((data: any) => {
                this.instData = data.json();
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
        let sessionData: Array<string>;
        sessionData = [];
        console.log("QueryList: ", this.tabData);
        //console.log("QueryListSize: ", this.tabData.size());
        let multiple_queries: Array<Query>;
        multiple_queries = [];

        for (let i = 0; i < this.tabData.size(); i++) {
            console.log("Entrou no loop");
            let q = this.tabData.getItem(i);
            if (this.tabData.isUnique(q)) {
                sessionData.push('"' + q.getRA() + '":"' + q.getTime() + '"');
            } else {
                multiple_queries.push(q);
            }
        }
        for (let i = 0; i < multiple_queries.length; i++) {
            let RA_queries: Array<Query>;
            RA_queries = [];
            let q = multiple_queries.shift();
            if (q.getRA() != 0) {
                RA_queries.push(q);
            }
            for (let l = 0; l < multiple_queries.length; l++) { //l= i+1?
                if (q.getRA() == multiple_queries[i].getRA()) {
                    if (multiple_queries[i].getRA() != 0) {
                        RA_queries.push(multiple_queries[i]);
                    }
                    multiple_queries[i] = new Query(0, null);
                }
            }
            let txt = this.queryArrayToString(RA_queries);
            sessionData.push(txt);
        }
        //sessionData = sessionData.substr(0, sessionData.lastIndexOf(",") - 1);
        console.log("*************SessionData to be uploaded: ");
        console.log(sessionData);
        return new Promise((resolve, reject) => {
            firebase.database().ref('/sessions/' + this.getInstitutionKey(userInfo.institution) + '/' + this.sessionID).set(
                sessionData
            ).then(() => {
                firebase.database().ref('/sessions/index/' + this.sessionID).set({
                    "sharedID": shareID,
                    "institution": this.getInstitutionKey(userInfo.institution),
                    "user": userInfo.name
                }).then(() => {
                    resolve();
                },
                    error => reject(error));
            },
                error => reject(error)); // fazer timeout
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

    private queryArrayToString(list: Array<Query>) {
        let res = '"' + list[0].getRA() + '":';
        for (let i = 0; i < list.length; i++) {
            res += '"' + list[i].getTime() + ','
        }
        res = res.substr(0, res.lastIndexOf(",") - 1);
        res += '"';
        return res;
    }
}
