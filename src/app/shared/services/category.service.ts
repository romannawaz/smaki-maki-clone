import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';

import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryRef: AngularFirestoreCollection<ICategory> = null;
  private dbPath = '/category';

  constructor(
    private db: AngularFirestore
  ) {
    this.categoryRef = this.db.collection(this.dbPath);
  }

  getFireCloudCategories(): AngularFirestoreCollection<ICategory> {
    return this.categoryRef;
  }

  addFireCloudCategory(category: ICategory): Promise<DocumentReference<ICategory>> {
    return this.categoryRef.add({ ...category });
  }

  updateFireCloudCategory(id: string, category: ICategory): Promise<void> {
    return this.categoryRef.doc(id).update({ ...category });
  }

  deleteFireCloudCategory(id: string): Promise<void> {
    return this.categoryRef.doc(id).delete();
  }
}
