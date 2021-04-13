import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
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
    this.auth.createUserWithEmailAndPassword(email, password);
  }

  signInUser(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        const userUID = userResponse.user.uid;

        localStorage.setItem('user', JSON.stringify(userUID));

        this.setAuthState(true);

        let newUser = new User(userUID);

        this.db.collection('/user').add({ ...newUser });

        this.router.navigateByUrl('/cabinet');
      })
      .catch(err => {
        console.log(err);
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

  getFireCloudUserByUserUID(): void {
    let userUID = JSON.parse(localStorage.getItem('user'));

    // this.db.collection('/user', ref => ref.where('userUID', '==', userUID))
    //   .get()
    //   .pipe(
    //     map(changes => ({ id: changes.id, ...changes.data() }))
    //   )

    // this.db.collection('/user', ref => ref.where('userUID', '==', userUID))
    //   .get()
    //   .pipe(
    //     map(changes => ({ id: changes.id, ...changes.data() }))
    //   )
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
