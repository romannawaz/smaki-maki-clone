import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IVacancy } from '../interfaces/vacancy.interface';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  vacancyRef: AngularFirestoreCollection<IVacancy> = null;
  private dbPath = '/vacancy';

  constructor(
    private db: AngularFirestore
  ) {
    this.vacancyRef = this.db.collection(this.dbPath);
  }

  getFireCloudVacancies(): AngularFirestoreCollection<IVacancy> {
    return this.vacancyRef;
  }

  addFireCloudVacancy(vacancy: IVacancy): Promise<DocumentReference<IVacancy>> {
    return this.vacancyRef.add({ ...vacancy });
  }

  updateFireCloudVacancy(id: string, vacancy: IVacancy): Promise<void> {
    return this.vacancyRef.doc(id).update({ ...vacancy });
  }

  deleteFireCloudVacancy(id: string): Promise<void> {
    return this.vacancyRef.doc(id).delete();
  }
}
