import { IBasket } from "./basket.interface";

export interface IOrder {
    userID: string,

    userName: string;
    userPhone: string;
    userEmail: string;

    street: string;
    house: string;
    apartment: string;
    entrance: string;
    floor: string;

    products: IBasket[];

    status: string;
    shortDescription: string;
    totalPrice: string;

    comment?: string;
}