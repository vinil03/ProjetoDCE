import { Injectable } from '@angular/core';
@Injectable()

export class Query {
    private name: string;
    private RA: number;
    private time: string;
    private typer: string;
    constructor(ra: number, time: string, name: string) {
        this.RA = ra;
        this.time = time;
        this.typer = name;
    }
    setName(n: string) {
        if (n.length > 20) {
            this.name = n.substring(0, 20);
        } else {
            this.name = n;
        }
    }
    getRA() {
        return this.RA;
    }
    getName() {
        return this.name;
    }
    getTime() {
        return this.time;
    }
    getTyper() {
        return this.typer;
    }
}