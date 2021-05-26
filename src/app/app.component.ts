import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from "./services/auth.service";
import {CoreService} from "./services/core.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: 'app-root';

  userMenuItem: any[] = [
      {
        icon: 'person',
        title: 'Profile',
        url: 'profile'
      },
      {
        icon: 'book',
        title: 'Board',
        url: '/'
      },
      {
        icon: 'logout',
        title: 'Logout',
        url: 'logout'
      }
  ];

  kanbanBoard = {
    todos: [],
    inProgress: [],
    revision: [],
    finish: []
  };


  user;
  subUser;
  constructor(private matSnackBar:MatSnackBar,
              private authService:AuthService,
              private coreService:CoreService) {
    this.checkUser(null);
  }

  checkUser(credential) {
    if(this.subUser) {this.subUser.unsubscribe();}
    this.subUser = this.authService.authUser.subscribe(async (userDoc: any | null) => {
      if(userDoc === undefined) {
        this.user = await this.authService.createDoc(credential);
      }
      else {
        this.user = userDoc;
        if(userDoc) {
          this.kanbanBoard = userDoc.board;
        }

        console.log(userDoc);
      }
    });
  }

  logIn() {
    if(this.subUser) {this.subUser.unsubscribe();}
    this.authService.register().then((credential) => {
      this.checkUser(credential.user);
    })
  }

  logOutAll() {
    this.authService.logOut().then(r => console.log(r)).catch(e => console.log('e'));
  }

  drop(event: CdkDragDrop<string []>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.autoSaveData();
  }


  autoSaveTimerInterval = null;
  autoSaveTimer: number = 0;
  autoSaveTimeout = null;

  autoSaveData() {
    if(this.autoSaveTimerInterval) {
      clearInterval(this.autoSaveTimerInterval);
      this.autoSaveTimer = 0;
    }
    this.autoSaveTimerInterval = setInterval(() => {

      if(this.autoSaveTimer >= 100) {
        this.autoSaveTimer = 0;

        clearInterval(this.autoSaveTimerInterval);
      }
      else {
        ++this.autoSaveTimer;
      }
    },100);

    if(this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    this.autoSaveTimeout = setTimeout(() => {
      return this.saveStorage();
    },10000);
  }

 async saveStorage() {
    await this.coreService.saveBoard(this.user.uid, this.kanbanBoard);
    this.matSnackBar.open('Saved Success!', 'Done', { duration: 3000, panelClass: ["custom-style"]
    });
  }

  removeItem(taskColumn, task) {
    return this.coreService.removeTasks(this.user.uid, taskColumn, task);
  }

}
