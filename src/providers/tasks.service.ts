import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TasksService {

  // public properties

  public connected = true;
  public onDisconnect: Observable<any>;
  public onConnect: Observable<any>;
  public db: SQLiteObject = null;

  constructor(public http: HttpClient,
    public network: Network) {
    console.log('TASKS SERVICES LOADED');
  }
  // public methods
  public init() {
    this.onDisconnect = this.network.onDisconnect();
    this.onDisconnect.subscribe(() => {
      console.log('network was disconnected :-(');
      this.connected = false;
    });
    this.onConnect = this.network.onConnect();
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.connected = true;

      // STEPS TODO HERE
      // Get all the rows with sync = false (boolean) //Done
      // then send it to the server
    
      // Check and control the if the response from the sql server was true
      // if true then
      // was correctly saved from the server
      // else 
      // try to send it again

      this.getAllSync().then((unsyncList: any) => {
        console.log('BEFORE FOR: ', unsyncList.rows.item(0));
        console.log('BEFORE FOR: ', unsyncList.rows.item(1));
        console.log('BEFORE FOR: ', unsyncList.rows.item(2));
        console.log('BEFORE FOR: ', unsyncList.rows.item(3));

        let tasks = [];
        for (let i = 0; i < unsyncList.rows.length; i++) {
          console.log('UNSYNCLIST IN FOR: ', unsyncList.rows.item());

          tasks.push(unsyncList.rows.item(i));
        }
        // SEND QUERY HERE FOR ALL THE ROW'S THAT HAVE sync in false
        // unsyncList contains all the rows with sync = false

        //HTTP QUERY GOES HERE!
       /*  this.http.post('https://dondevayaesto.domain',
        {
          cardToken: token,
          amount, 500
        },
        {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(data => {
          console.log(data.data);
        }).catch(error => {
          console.log(error.status);
        }); */
        //Then if the http query is succesfuly, update the sync in the db
        // this.updateTask(unsyncList.findIndex());

      })
        .catch(error => Promise.reject(error));

      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }

  public iAmConnected() {

    return this.connected;

  }
  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  create(task: any) {
    // console.log('TASKS CONTENT', task.toString());

    let sql = 'INSERT INTO tasks(url, data, sync, params, date, type) VALUES(?,?,?,?,?,?)';
    //console.log('SQL INSERT TASKS: ', sql.toString());
    return this.db.executeSql(sql, [task.url, task.data, task.sync, task.params, task.date, task.type]);
  }

  createTable() {

    let sql = 'CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR, data VARCHAR, sync bit, params VARCHAR, date date, type VARCHAR)';
    return this.db.executeSql(sql, []);
  }

  delete(task: any) {
    let sql = 'DELETE FROM tasks WHERE id=?';
    return this.db.executeSql(sql, [task.id]);
  }

  getAll() {

    let sql = "SELECT * FROM tasks";
    return this.db.executeSql(sql, [])
      .then(response => {
        let tasks = [];
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push(response.rows.item(index));
        }
        return Promise.resolve(tasks);
      })
      .catch(error => Promise.reject(error));
  }

  getAllSync() {

    let syncState = false;
    let sql = "SELECT * FROM tasks WHERE sync = ?";
    return this.db.executeSql(sql, [syncState])
      .then(response => {
        let tasks = [];
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push(response.rows.item(index));
        }
        return Promise.resolve(tasks);
      })
      .catch(error => Promise.reject(error));
  }

  updateTask(sync: any, task: any) {
    let sql = 'UPDATE tasks SET sync = ? WHERE id = ?';
    return this.db.executeSql(sql, [task.sync, task.id]);
  }

  // Idk if we recive any arrays but i created the method
  parseObjectArraytoJSON(array) {
    var jsonArray = [];
    for (var i = 0; i < array.length; ++i) {
      jsonArray.push(array[i].toJSON());
    }
    return jsonArray;
  }
}