import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/timeout';

@Injectable()

export class CheckerApi {
    private baseUrl = 'https://dcechecker.firebaseio.com';

    constructor(private http: Http) {

    }

    getDataBase() {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.baseUrl}/ass.json`).timeout(20000).subscribe((data) => {
                resolve(data.json());
            }, error => {reject()});
        });
    }
}
