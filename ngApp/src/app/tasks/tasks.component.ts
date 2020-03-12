import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { TasksService } from './tasks-service.service';
import { Task } from './task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  task:Task = new Task();
  tasks: Task[] = [];
  isLoading = false;
  private tasksSub: Subscription;
  currentDate = new Date();
  nameMember: string;

  MembersNames = ['Mohamed','Ahmed','Omar','Hassan','Hussien','Mohsen','Mahmoud','Amr','Atef','Amir','Hisham','Eslam']
  @ViewChild('memName', {static: true}) memName: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private tasksService : TasksService) { }

  ngOnInit() {
    console.log(this.currentDate);
    this.tasksService.getTasks();
    this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((tasks: Task[]) => {
        this.isLoading = false;
        this.tasks = tasks;
        console.log(tasks);
      });
  }

  searchMemberNames = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.memName.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.MembersNames
        : this.MembersNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  checkNames(name){
    console.log(name);
    var flag = 1;
    for(var i =0;i<=this.MembersNames.length;i++){
      if(name == this.MembersNames[i]){
        flag = flag * 0;  
      }else{
        flag = flag * 1;  
      }
    }
    console.log(flag);
    if(flag == 1){
      this.nameMember = "";
    }
  }

  addTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const task: Task = {
       id: null, 
       memberName: form.value.memberName,
       description: form.value.description,
       date: form.value.date,   
       isDone: false 
      };
    this.tasksService.addTask(task);
    form.resetForm();
  }

  deleteTask(taskId: string) {
    this.tasksService.deletePost(taskId);
  }

  updateTask(Task: Task) {
    console.log(Task)
    const task: Task = {
      id: Task.id, 
      memberName: Task.memberName,
      description: Task.description,
      date: Task.date,   
      isDone: !Task.isDone 
     };
    this.tasksService.updatePost(task);
  }

  deleteAll(){
    this.tasksService.deleteAll();
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }

}
