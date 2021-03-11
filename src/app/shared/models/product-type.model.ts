import { IType } from "../interfaces/type.interface";

export class ProductType implements IType {
    constructor(
        public subcategoryID: string,
        public name: string
    ) { }
}
