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

        this.getAll().then((unsyncList) =>{
          console.log('UNSYNCLIST FROM DB: ',unsyncList);
          // Get all the rows with sync = false (boolean)
          // then send it to the server
          
        })
        .catch(error => Promise.reject(error));

        // SEND QUERY HERE FOR ALL THE ROW'S THAT HAVE sync in false

        
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
  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  create(task: any){
   // console.log('TASKS CONTENT', task.toString());
   //TO DO: Add the type of the query ( POST, PUT, GET );

    let sql = 'INSERT INTO tasks(url, data, sync, params, date) VALUES(?,?,?,?,?)';
    //console.log('SQL INSERT TASKS: ', sql.toString());
    return this.db.executeSql(sql, [task.url, task.data, task.sync, task.params, task.date]);
  }

  createTable(){

    let sql = 'CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR, data VARCHAR, sync VARCHAR, params VARCHAR, date VARCHAR)';
    return this.db.executeSql(sql, []);
  }

  delete(task: any){
    let sql = 'DELETE FROM tasks WHERE id=?';
    return this.db.executeSql(sql, [task.id]);
  }

  getAll(){
    
    let sql = "SELECT * FROM tasks WHERE sync LIKE 'false' ";
    return this.db.executeSql(sql, [])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }

  update(task: any){
    let sql = 'UPDATE tasks SET title=?, completed=? WHERE id=?';
    return this.db.executeSql(sql, [task.title, task.completed, task.id]);
  }

}