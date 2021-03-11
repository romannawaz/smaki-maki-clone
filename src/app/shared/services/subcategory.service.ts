import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';

import { ISubcategory } from '../interfaces/subcategory.interface';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  subcategoryRef: AngularFirestoreCollection<ISubcategory> = null;
  private dbPath = '/subcategory';

  constructor(
    private db: AngularFirestore
  ) {
    this.subcategoryRef = this.db.collection(this.dbPath);
  }

  getFireCloudSubcategories(): AngularFirestoreCollection<ISubcategory> {
    return this.subcategoryRef;
  }

  getFireCloudSubcategoriesByCategoryID(categoryID: string): AngularFirestoreCollection<ISubcategory> {
    return this.db.collection(this.dbPath, ref => ref.where('categoryID', '==', categoryID));
  }

  getFireCloudSubcategoryByUrlName(urlName: string): AngularFirestoreCollection<ISubcategory> {
    return this.db.collection(this.dbPath, ref => ref.where('urlName', '==', urlName));
  }

  addFireCloudSubcategory(subcategory: ISubcategory): Promise<DocumentReference<ISubcategory>> {
    return this.subcategoryRef.add({ ...subcategory });
  }

  updateFireCloudSubcategory(id: string, category: ISubcategory) {
    return this.subcategoryRef.doc(id).update({ ...category });
  }

  deleteFireCloudSubcategory(id: string): Promise<void> {
    return this.subcategoryRef.doc(id).delete();
  }
}
