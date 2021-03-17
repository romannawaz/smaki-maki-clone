import { ISubcategory } from "../interfaces/subcategory.interface";

export class Subcategory implements ISubcategory {
    constructor(
        public categoryID: string,
        public urlName: string,
        public name: string
    ) { }
}