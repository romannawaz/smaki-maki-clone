import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private authSubjuect = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    if (localStorage.getItem('user')) {
      this.authSubjuect.next(true);
    }
  }

  signUpUser(email: string, password: string): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        const userUID = response.user.uid;

        let newUser = new User(userUID);

        this.db.collection('/users').add({ ...newUser })
        // .then(() => {

        // })
        // .catch(err => {
        //   console.log(err);
        // });
      });
  }

  signInUser(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        const userUID = userResponse.user.uid;

        this.setAuthState(true);

        this.getFireCloudUserByUserUID(userUID)
          .snapshotChanges()
          .pipe(
            map(changes => changes.map(user => ({ id: user.payload.doc.id })))
          )
          .subscribe(data => {
            localStorage.setItem('user', JSON.stringify(data[0].id));
            // this.getUserBonuses().then(data => console.log(data));
          });


        this.router.navigateByUrl('/cabinet');
      });
  }

  signOutUser(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.setAuthState(false);

        this.router.navigateByUrl('/about');
      })
      .catch(err => console.log(err));
  }

  getUserBonuses(): Promise<number> {
    let userUID = JSON.parse(localStorage.getItem('user'));

    return this.db.collection('/users')
      .doc(userUID)
      .get()
      .pipe(
        map(changes => changes.data()['bonuses'])
      )
      .toPromise();
  }

  setUserBonuses(bonuses: string): void {
    let userUID = JSON.parse(localStorage.getItem('user'));

    this.getUserBonuses().then(currentBonuses => {
      this.db.collection('/users').doc(userUID).update({ bonuses: +currentBonuses + +bonuses });
    });
  }

  getFireCloudUserByUserUID(userUID: string): AngularFirestoreCollection<any> {
    return this.db.collection('/users', ref => ref.where('userUID', '==', userUID));
  }

  getStateChanges(): Observable<boolean> {
    return this.authSubjuect.asObservable();
  }

  getCurrentState(): boolean {
    return this.authSubjuect.getValue();
  }

  setAuthState(state: boolean): void {
    this.authSubjuect.next(state);
  }

}
