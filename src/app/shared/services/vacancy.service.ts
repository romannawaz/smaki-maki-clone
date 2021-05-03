import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IVacancy } from '../interfaces/vacancy.interface';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  vacancyRef: AngularFirestoreCollection<IVacancy> = null;
  private dbPath = '/vacancy';

  public readonly data$;

  constructor(
    private db: AngularFirestore
  ) {
    this.vacancyRef = this.db.collection(this.dbPath);
    this.data$ = this.getFireCloudVacanciesResolver();
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

  // For resolver test
  getFireCloudVacanciesResolver(): Observable<IVacancy[]> {
    return this.vacancyRef
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(vac => ({ id: vac.payload.doc.id, ...vac.payload.doc.data() })))
      );
  }
}
