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
    private userData: any;

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

    saveUserInformation(userInfo: any){
        this.userData = userInfo;
      }

    getUserInformation(){
        return this.userData;
    }  

    getBDVersion(inst: string) { // fazer versão de dados de cada uma

        this.http.get(`${this.baseUrl}/institutions.json`).subscribe((data: any) => {
            var data2  = data.json();
            for(var key in data2){
                if (data2[key].Name == inst) {
                    console.log("DBVersion: ",data2[key].DBVersion);
                    return data2[key].DBVersion;
                  }
            }
           });    
    }
}
