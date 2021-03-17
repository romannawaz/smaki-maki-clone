import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productRef: AngularFirestoreCollection<IProduct> = null;
  private dbPath = '/products';

  constructor(
    private db: AngularFirestore
  ) {
    this.productRef = this.db.collection(this.dbPath);
  }

  getFireCloudProducts(): AngularFirestoreCollection<IProduct> {
    return this.productRef;
  }

  getFireCloudProductByID(id: string): AngularFirestoreDocument<IProduct> {
    return this.productRef.doc(id);
  }

  getFireCloudProductsByCategoryID(categoryID: string): AngularFirestoreCollection<IProduct> {
    return this.db.collection(this.dbPath, ref => ref.where('categoryID', '==', categoryID));
  }

  getFireCloudProductsBySubcategoryID(subcategoryID: string): AngularFirestoreCollection<IProduct> {
    return this.db.collection(this.dbPath, ref => ref.where('subcategoryID', '==', subcategoryID));
  }

  getFireCloudProductsByTypeID(typeID: string): AngularFirestoreCollection<IProduct> {
    return this.db.collection(this.dbPath, ref => ref.where('typesID', 'array-contains', typeID));
  }

  addFireCloudProduct(product: IProduct): Promise<DocumentReference<IProduct>> {
    return this.productRef.add({ ...product });
  }

  updateFireCloudProduct(id: string, product: IProduct): Promise<void> {
    return this.productRef.doc(id).update({ ...product });
  }

  deleteFireCloudProduct(id: string): Promise<void> {
    return this.productRef.doc(id).delete();
  }
}
