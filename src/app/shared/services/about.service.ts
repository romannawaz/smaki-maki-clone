import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IQuote } from '../interfaces/quote.interface';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  aboutRef: AngularFirestoreCollection<IQuote>
  private dbPath = '/qoute';

  constructor(
    private db: AngularFirestore
  ) {
    this.aboutRef = this.db.collection(this.dbPath);
  }

  addFireCloudQoute(qoute: IQuote): Promise<DocumentReference<IQuote>> {
    return this.aboutRef.add({ ...qoute });
  }
}
