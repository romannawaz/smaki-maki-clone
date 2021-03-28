import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private authSubjuect = new BehaviorSubject(false);

  constructor(
    private router: Router,
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
        this.router.navigateByUrl('/cabinet');
      })
      .catch(err => {
        console.log(err)
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
