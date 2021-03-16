import { IProduct } from "../interfaces/product.interface";

export class Product implements IProduct {
    constructor(
        public categoryID: string,
        public image: string,
        public name: string,
        public price: string,
        public weight: string,
        public description: string = null,
        public discount: string = null,
        public subcategoryID: string = null,
        public typeID: string = null,
    ) { }
}