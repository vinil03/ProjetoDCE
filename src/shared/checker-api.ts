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

    constructor(private http: Http) {
        this.tabData = new List();
    }

    getDataBase() {
        return new Promise((resolve) => {
            this.http.get(`${this.baseUrl}/associates.json`).subscribe((data) => {
                resolve(data.json());
                console.log("Fez database");
            });
        });
    }

    getUserData(uid: string) {
        return new Promise((resolve, reject) => {
            //console.log("UID: ", uid );
            this.http.get(`${this.baseUrl}/userProfile/` + uid + `/.json`).timeout(20000).subscribe((data) => {
                resolve(data.json());
            }, error => { reject() });
        });
    }

    updateDevice(uid: string, deviceInfo: any) {
        firebase.database().ref('/userProfile/' + uid + '/deviceInfo/').set({
            deviceInfo
        });
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

    getInstitutionKey(inst: string): string{
        for (let i; i < this.instData.lengh; i++) {
            if (this.instData[i].Name == inst) {
                return i;                
            }
        }
    }

    setSessionID(id: any){
        this.sessionID = id;
    }

    uploadSession(userInfo: any) { //GET SESSION ID
        let instKey;
        let sessionData = "";
        console.log("Session ID: ", this.sessionID);
        console.log("QueryList: ", this.tabData);
        console.log("QueryListSize: ", this.tabData.size());

        for(let i; i < this.tabData.size(); i++){
            console.log("Entrou no loop");
            let q = this.tabData.getItem(i);
            sessionData = '"'+ q.getRA() + '","' + q.getTime() + '"' + sessionData;
            console.log("Session data: ", sessionData);
            if(i<this.tabData.size()){ //faz qd está na ultima linha?
                sessionData = sessionData + ",";
            }
        }
        console.log("*************SessionData to be uploaded: ");
        console.log(sessionData);
        console.log("JSON: ", JSON.stringify(sessionData));          
        return new Promise((resolve, reject) => {
            resolve();
            firebase.database().ref('/sessions/' + this.getInstitutionKey(userInfo.institution) + '/' + this.sessionID).set({

            }).then(() => {
                resolve();
            },
                error => reject(error));           
        });
    }
}
