import { Query } from '../resources/Query';

export class List<T> {
    private items: Array<Query>;

    constructor() {
        this.items = [];
    }

    size(): number {
        return this.items.length;
    }

    add(value: Query): void {
        this.items.push(value);
    }

    getItem(index: number): Query {
        return this.items[index];
    }

    isUnique(q: Query): boolean {
        let ra = q.getRA();
        let count = 0;
        for (let i of this.items) {
            if (i.getRA() == ra) {
                count++;
            }
        }
        if (count > 1) {
            return false;
        } else {
            return true;
        }
    }

    arrange(): any {
        /*this.items.sort((a, b): number => {
            if (a.getRA() < b.getRA()) return -1;
            if (a.getRA() > b.getRA()) return 1;
            return 0;
        });*/
    }

    clear(): void {
        this.items.length = 0;
    }
}