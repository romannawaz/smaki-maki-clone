import { IProduct } from "./product.interface";

export interface IBasket {
    products: IProduct[],
    count: string
}