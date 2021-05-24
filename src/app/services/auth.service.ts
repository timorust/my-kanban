import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase/app";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser: any;
  constructor(private angularFireAuth:AngularFireAuth,
              private angularFirestore:AngularFirestore) {

    this.authUser = this.angularFireAuth.authState.pipe(
      switchMap(enterAuth => {
        if(enterAuth) {
          return this.angularFirestore.doc(`users/${enterAuth.uid}`).valueChanges();

        }
        else {
          return of(null);

        }
      })
    )
  }

  register() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider);
  }

  createDoc(credentialAuth) {
    return this.angularFirestore.doc(`users/${credentialAuth.uid}`).set({
      uid: credentialAuth.uid,
      name: credentialAuth.displayName,
      email: credentialAuth.email,
      photoUrl: credentialAuth.photoURL,
      board:  {
        todos: [
          'Learn Full Stack',
          'Master Angular'
        ],
        inProgress: [],
        revision: [],
        finish: []
      }
    });

  }
  logOut() {
    return this.angularFireAuth.signOut();
  }
}
