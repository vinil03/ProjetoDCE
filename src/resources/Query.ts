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
    public setName(n: string) {
        if (n.length > 30) {
            this.name = n.substring(0, 30);
        } else {
            this.name = n;
        }
    }
    public getRA() {
        return this.RA;
    }
    public getName() {
        return this.name;
    }
    public getTime() {
        return this.time;
    }
    public getTyper() {
        return this.typer;
    }
}