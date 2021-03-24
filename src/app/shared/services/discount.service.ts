import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IDiscount } from '../interfaces/discount.interface';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private dbPath = '/discount'
  discountRef: AngularFirestoreCollection<IDiscount> = null;

  constructor(
    private db: AngularFirestore
  ) {
    this.discountRef = this.db.collection(this.dbPath);
  }

  getFireCloudDiscounts(): AngularFirestoreCollection<IDiscount> {
    return this.discountRef;
  }

  addFireCloudDiscount(discount: IDiscount): Promise<DocumentReference<IDiscount>> {
    return this.discountRef.add({ ...discount });
  }

  updateFireCloudDiscount(id: string, discount: IDiscount): Promise<void> {
    return this.discountRef.doc(id).update({ ...discount });
  }

  deleteFireCloudDiscount(id: string): Promise<void> {
    return this.discountRef.doc(id).delete();
  }
}
