import { IBasket } from "../interfaces/basket.interface";
import { IProduct } from "../interfaces/product.interface";

export class Basket implements IBasket {
    constructor(
        public product: IProduct,
        public count: number = 1
    ) { }
}