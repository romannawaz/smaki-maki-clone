import { IVacancy } from "../interfaces/vacancy.interface";

export class Vacancy implements IVacancy {
    constructor(
        public title: string,
        public description: string,
        public pathToImage: string
    ) { }
}