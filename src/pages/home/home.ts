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

  tasks: any[] = [];

  // private fields 

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public tasksService: TasksService
  ) {}

  // Ionic's or Angular's triggers

  public testConnection() {

    console.log('WORKS');
    if (this.tasksService.iAmConnected()) {
        console.log('AVAILABLE FOR SEND QUERY');

    } else {
        console.log('NOT AVAILABLE FOR SEND QUERY');

    }

}
  ionViewDidLoad(){
    this.tasksService.init();
  }

  // public methods

  deleteTask(task: any, index){
    this.tasksService.delete(task)
    .then(response => {
      console.log( response );
      this.tasks.splice(index, 1);
    })
    .catch( error => {
      console.error( error );
    })
  }

  getAllTasks(){
    this.tasksService.getAll()
    .then(tasks => {
      console.log(tasks);
      this.tasks = tasks;
    })
    .catch( error => {
      console.error( error );
    })
  }

  updateTask(task, index){
    task = Object.assign({}, task);
    task.completed = !task.completed;
    this.tasksService.update(task)
    .then( response => {
      this.tasks[index] = task;
    })
    .catch( error => {
      console.error( error );
    })
  }

  insertSQL(){

    /* name: item.name + ' ' + item.lastName,
    userId: item.objectId,
    image: item.image ? item.image.url : '',
    shortName: item.name,
    itsNotMe: item.objectId !== this.currentuserId 
    url, data, sync, params, date
    
    */

    let data: any = 
    {
      url: 'http://chamomarica.com',
      data: 'Insert Json Here',
      sync: 'True',
      params: 'Parap pa pa params (8)',
      date: '2018-01-01'

    }
    
    this.tasksService.create(data)
            .then(response => {
              this.tasks.unshift( data );
            })
            .catch( error => {
              console.error( error );
            })
  }
}
