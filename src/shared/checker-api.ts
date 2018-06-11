import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class CheckerApi {
    private baseUrl = 'https://dcechecker.firebaseio.com';

    constructor(private http: Http) {

    }

    getDataBase() {
        return new Promise((resolve) => {
            this.http.get(`${this.baseUrl}/ass.json`).subscribe((data) => {
                resolve(data.json());
            });
        });
    }
}
