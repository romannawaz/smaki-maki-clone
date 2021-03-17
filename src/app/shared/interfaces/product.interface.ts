export interface IProduct {
    categoryID: string;
    image: string;
    imageDetails: string;
    name: string;
    price: string;
    weight: string;
    description: string;
    discount: string;
    subcategoryID?: string;
    typesID?: string[];
    id?: string;
}