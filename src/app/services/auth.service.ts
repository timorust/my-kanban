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
      switchMap(project => {
        if(project) {
          return this.angularFirestore.doc(`users/${project.uid}`).valueChanges();

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

  createDoc(userObject) {
    return this.angularFirestore.doc(`users/${userObject.uid}`).set(userObject);

  }
  logOut() {
    return this.angularFireAuth.signOut();
  }
}
