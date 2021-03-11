import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IType } from '../interfaces/type.interface';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  typeRef: AngularFirestoreCollection<IType> = null;
  private dbPath = '/type';

  constructor(
    private db: AngularFirestore
  ) {
    this.typeRef = this.db.collection(this.dbPath);
  }

  getFireCloudTypes(): AngularFirestoreCollection<IType> {
    return this.typeRef;
  }

  getFireCloudTypesBySubcategoryID(subcategoryID: string): AngularFirestoreCollection<IType> {
    return this.db.collection(this.dbPath, ref => ref.where('subcategoryID', '==', subcategoryID));
  }

  addFireCloudType(type: IType): Promise<DocumentReference<IType>> {
    return this.typeRef.add({ ...type });
  }

  updateFireCloudType(id: string, type: IType): Promise<void> {
    return this.typeRef.doc(id).update({ ...type });
  }

  deleteFireCloudType(id: string): Promise<void> {
    return this.typeRef.doc(id).delete();
  }
}
