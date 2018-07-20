import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/timeout';
import { List } from '../resources/List';
import { Query } from '../resources/Query';

@Injectable()

export class CheckerApi {
  
      
    private baseUrl = 'https://dcechecker.firebaseio.com';
    private dataBase = null;
    private tabData: List<Query>;
    

    constructor(private http: Http) {
        this.tabData = new List();
    }

    getDataBase() {
            return new Promise((resolve, reject) => {
                this.http.get(`${this.baseUrl}/associates.json`).subscribe((data) => {
                    resolve(data.json());
                });
            });
    }

    getUserData(uid: string) {
        return new Promise((resolve, reject) => {
            console.log("UID: ", uid );
            this.http.get(`${this.baseUrl}/userProfile/`+uid+`/.json`).timeout(20000).subscribe((data) => {
                resolve(data.json());
            }, error => { reject() });
        });
      }

    getTabData(){
        return this.tabData;
    }

    addTabData(q: Query){
        this.tabData.add(q);
    }

    getBDVersion(s: string){ // fazer versão de dados de cada uma
        return "BD: 28/05";
    }
}
