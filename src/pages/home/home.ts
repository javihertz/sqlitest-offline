import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { TasksService } from '../../providers/tasks.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // public properties

  public taskList: any;
  public rowsInDb: any;
  // private fields 

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public tasksService: TasksService,
  ) { }

  // Ionic's or Angular's triggers

  public testConnection() {

    console.log('WORKS');
    if (this.tasksService.iAmConnected()) {
      console.log('AVAILABLE FOR SEND QUERY');

    } else {
      console.log('NOT AVAILABLE FOR SEND QUERY');

    }

  }
  ionViewDidLoad() {
  }

  // public methods

  deleteTask(task: any, index) {
    this.tasksService.delete(task)
      .then(response => {
        console.log(response);
        this.taskList.splice(index, 1);
      })
      .catch(error => {
        console.error(error);
      })
  }

  getAllTasks() {
    this.tasksService.getAll()
      .then(tasks => {
        console.log(tasks);
        this.taskList = tasks;
        if (this.taskList.rows.length > 0) {
          this.rowsInDb = [];
          for (let i = 0; i < this.taskList.rows.length; i++) {
            console.log('ITEM: ', this.taskList.rows.item(i));
            this.rowsInDb.push({
              "id": this.taskList.rows.item(i).id,
              "url": this.taskList.rows.item(i).url,
              "sync": this.taskList.rows.item(i).sync,
              "params": this.taskList.rows.item(i).params,
              "date": this.taskList.rows.item(i).date,
              "type": this.taskList.rows.item(i).type
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
      
  }

  // SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true).
  updateTaskById(task, index){
    
    task = Object.assign({}, task);
    task.id = 18;
    task.sync = 1;
    
    this.tasksService.updateTask(task)
    .then( response => {
      this.taskList[index] = task;
    })
    .catch( error => {
      console.error( error );
    })
  }
 /*  updateTaskById() {

    let task = {
      sync : true,
      id: 3
    }
    // task.completed = !task.completed;
    this.tasksService.updateTask(task.sync, task.id)
      .then(response => {
           this.taskList[task.id] = task;
        // this.taskList[index] = task;
      })
      .catch(error => {
        console.error(error);
      })
  } */

  insertSQL() {

    let queryUrl = 'http://www.google.es';
    let dataJson = { content: 'Insert Json Here' };
    let isSync = 0;
    let parameters = 'Subí y bajá';
    let inDate = new Date();
    let queryType = 'GET';

    let data: any =
      {
        url: queryUrl,
        data: JSON.stringify(dataJson),
        sync: isSync,
        params: parameters,
        date: inDate,
        type: queryType
      }

    this.tasksService.create(data)
      .then(response => {
        this.taskList.unshift(data);
      })
      .catch(error => {
        console.error(error);
      })
  }
}
