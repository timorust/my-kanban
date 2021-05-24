import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CoreService} from "../../services/core.service";

@Component({
  selector: 'ak-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  @Input() serviceUser: any;
  addNewForm: FormGroup;


  constructor(private formBuilder:FormBuilder,
              private coreService:CoreService) { }

  ngOnInit(): void {
    this.addNewForm = this.formBuilder.group({
      task: ['', Validators.required]
    });
  }

  addNewTask() {
    const subTask = this.addNewForm.value.task;
    return this.coreService.addToServer(this.serviceUser.uid, subTask).then((response) => {
      console.log(response);
    });
  }
}
