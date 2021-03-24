import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) { }

  signUpUser(email: string, password: string): void {
    this.auth.createUserWithEmailAndPassword(email, password);
  }

  signInUser(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = {
          email: userResponse.user.email,
          id: userResponse.user.uid,
          role: 'USER'
        }

        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(err => console.log(err));
  }

  signInAdmin(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        const admin = {
          email: userResponse.user.email,
          id: userResponse.user.uid,
          role: 'ADMIN'
        }

        localStorage.setItem('admin', JSON.stringify(admin));
        this.router.navigateByUrl('/admin');
      })
      .catch(err => console.log(err));
  }

  signOutAdmin(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/about');
      })
      .catch(err => console.log(err));
  }
}
