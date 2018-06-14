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

    getDataBase() { //Fazer um método que carrega todo o BD e dps divide em Atléticas
            return new Promise((resolve, reject) => {
                this.http.get(`${this.baseUrl}/ass.json`).timeout(20000).subscribe((data) => {
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

    getAtleticaData(s: string){ //fazer um enum? para receber como nome da atlética? -- fazer versão de dados de cada uma

    }

    getBDVersion(s: string){ // fazer versão de dados de cada uma
        return "BD: 28/05";
    }

}
