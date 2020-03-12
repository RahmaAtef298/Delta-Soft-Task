import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks: Task[] = [];
  private tasksUpdated = new Subject<Task[]>();
  private tasksUrl = "http://localhost:8080/api/"
  
  constructor(private http : HttpClient) { }

  getTasks() {
    this.http
      .get<{ message: string; tasks: any }>(`${this.tasksUrl}tasks`)
      .pipe(map((taskData) => {
        return taskData.tasks.map(task => {
          return {
            memberName: task.memberName,
            description: task.description,
            date: task.date,
            isDone: task.isDone,
            id: task._id
          };
        });
      }))
      .subscribe(returnedtasks => {
        this.tasks = returnedtasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  addTask(task: Task) {
    this.http
      .post<{ message: string, taskId: string }>(`${this.tasksUrl}task`, task)
      .subscribe(responseData => {
        const id = responseData.taskId;
        task.id = id;
        this.tasks.push(task);
        this.tasksUpdated.next([...this.tasks]);
        console.log(task);
      });
      
  }

  deletePost(taskId: string) {
    this.http.delete(`${this.tasksUrl}task/`+taskId)
      .subscribe(() => {
        const updatedTasks = this.tasks.filter(task => task.id !== taskId);
        this.tasks = updatedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }

  updatePost(task: Task) {
    console.log(task.id);
    this.http
      .put(`${this.tasksUrl}task/${task.id}`, task)
      .subscribe(response => {
        const updatedTasks = [...this.tasks];
        const oldTask = updatedTasks.findIndex(p => p.id === task.id);
        updatedTasks[oldTask] = task;
        this.tasks = updatedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }

  deleteAll(){
    const emptyList : Task[] = [];
    this.http.delete(`${this.tasksUrl}tasks/`)
    .subscribe(() => {
      this.tasks = emptyList;
      this.tasksUpdated.next([...this.tasks]);
    });
  }
}
