export class Query {
  
    private name: string;
    private RA: number;
    private time: string;
    private course: string;
    constructor(ra: number, time: string) {
        this.RA = ra;
        this.time = time;
    }
    public setName(n: string) {
        if (n.length > 30) {
            this.name = n.substring(0, 30);
        } else {
            this.name = n;
        }
    }

    public setCourse(c: string) {
       this.course = c;
      }

    public getCourse(){
        return this.course;
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

}