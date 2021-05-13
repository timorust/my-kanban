import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
    todos: [
      'Learn Full Stack',
      'Master Angular'
    ],
    inProgress: [],
    revision: [],
    finish: []
  }


  constructor(private matSnackBar:MatSnackBar) {
    this.importFromLocalStorage();
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
      this.saveInLocalStorage();
    },10000);
  }








  // autoSaveTimer: number = 0;
  // autoSaveTimeout = null;
  // autoSaveTimerInterval = null;
  //
  // autoSaveData() {
  //   if(this.autoSaveTimerInterval) {
  //     clearInterval(this.autoSaveTimerInterval);
  //     this.autoSaveTimer = 0;
  //   }
  //   this.autoSaveTimerInterval = setInterval(() => {
  //     ++this.autoSaveTimer;
  //
  //         if(this.autoSaveTimerInterval >= 100) {
  //           this.autoSaveTimer = 0;
  //           clearInterval(this.autoSaveTimerInterval);
  //         }
  //       },100);
  //
  //
  //   if(this.autoSaveTimeout) clearTimeout(this.autoSaveTimeout);
  //   this.autoSaveTimeout = setTimeout(() => {
  //     this.saveInLocalStorage();
  //   },10000);
  // }


  saveInLocalStorage() {
    const dataString = JSON.stringify(this.kanbanBoard);
    localStorage.setItem('my-kanban', dataString);
    this.matSnackBar.open('Saved Success!', 'Done', { duration: 3000 });
  }

  importFromLocalStorage() {
    const dataImport = localStorage.getItem('my-kanban');
    if(!dataImport) { return }
      const dataObject = JSON.parse(dataImport);
      this.kanbanBoard = dataObject;
  }
}
