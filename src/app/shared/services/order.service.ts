import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderRef: AngularFirestoreCollection<IOrder> = null;
  private dbPath = '/order';

  constructor(
    private db: AngularFirestore
  ) {
    this.orderRef = this.db.collection(this.dbPath);
  }

  getFireCloudOrdersByUserID(userID: string): AngularFirestoreCollection<IOrder> {
    return this.db.collection(this.dbPath, ref => ref.where('userID', '==', userID));
  }

  addFireCloudOrder(order: IOrder): Promise<DocumentReference<IOrder>> {
    return this.orderRef.add({ ...order });
  }
}
