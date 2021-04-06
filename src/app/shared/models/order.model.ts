import { IBasket } from "../interfaces/basket.interface";
import { IOrder } from "../interfaces/order.interface";

export class Order implements IOrder {
    status: string;

    constructor(
        public userID: string,
        
        public userName: string,
        public userPhone: string,
        public userEmail: string,

        public street: string,
        public house: string,
        public apartment: string,
        public entrance: string,
        public floor: string,

        public products: IBasket[],

        public comment?: string
    ) {
        this.status = 'unconfirmed';
    }
}