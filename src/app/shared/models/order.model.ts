import { IBasket } from "../interfaces/basket.interface";
import { IOrder } from "../interfaces/order.interface";

export class Order implements IOrder {
    status: string;
    shortDescription: string;
    totalPrice: string;

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

        this.shortDescription = products.map(product => product.product.name).join(', ') + '.';

        let totalPrice: number = 0;
        this.products.forEach(item => {
            totalPrice += parseInt(item.product.price) * item.count;
        });

        this.totalPrice = `${totalPrice} грн`;
    }
}