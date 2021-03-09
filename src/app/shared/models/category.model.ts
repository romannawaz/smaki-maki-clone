import { ICategory } from "../interfaces/category.interface";

export class Category implements ICategory {
    constructor(
        public name: string,
        public urlName: string,
        public icon: string
    ) {
        this.name = this.firstCapitalLetter(name);
    }

    firstCapitalLetter(string: string): string {
        let newString = string.trim().toLowerCase();

        return newString[0].toUpperCase() + newString.slice(1).toLowerCase();
    }
}