import { IUser } from "../interfaces/user.interface";

export class User implements IUser {
    constructor(
        public userUID: string,

        public name: string = '',
        public email: string = '',
        public phone: string = '',

        public bonuses: number = 0
    ) { }
}