import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import firebase from "firebase/app";
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private angularFirestore:AngularFirestore) { }

  saveBoard(userId, board) {
    return this.angularFirestore.doc(`users/${userId}`).update({
      [`board`]: board
    });
  }

  addToServer(userId, task) {
    return this.angularFirestore.doc(`users/${userId}`).update({
      [`board.todos`]: firestore.FieldValue.arrayUnion(task)
    });
  }

  removeTasks(userId, taskColumn, task) {
    return this.angularFirestore.doc(`users/${userId}`).update({
      [`board.${taskColumn}`]: firestore.FieldValue.arrayRemove(task)
    });
  }
}
