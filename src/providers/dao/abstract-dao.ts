import {SQLite} from 'ionic-native';

import { IDao } from './i-dao';

export abstract class AbstractDao<T> implements IDao<T> {

  private db: SQLite;

  constructor() {
    this.db = new SQLite();
  }

  abstract tableName(): string;
  abstract createTable(): string;
  abstract allColumns(): string;
  abstract addQuery(): string;
  abstract getAllQuery(): string;

  abstract fromBD(fila: any): T;
  abstract toBD(T): Array<any>;
  abstract toBdAdd(T): Array<any>;

  crearBBDD(): Promise<any> {
    console.log("SE VA A INTENTAR CREAR LA BASE DE DATOS: " + this.tableName());
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        console.log("Base de datos abierta correctamente: " + this.tableName());
        this.executeSql(this.createTable(), [] ).then(
          () => {
              this.cerrar().then(() => {resolve(true);});
          },
          (error) => {
            this.cerrar().then(() => {resolve(false);});
          }).catch(
            (reason) => {
              this.cerrar().then((reason) => {reject(reason);});
            }
          );

      }, (error) => {
        console.error("Unable to open database", error);
        this.cerrar().then(() => {reject(error);});
      }).catch((reason) => {
        console.error("Unable to create database", reason);
        this.cerrar().then(() => {reject(reason);});
      });
    });

    return resul;
  }

  getAll(): Promise<Array<T>> {
    //this.showAlert("getAll", "INICIO");
    return this.cargarTodas();
  }

  private cargarTodas(): Promise<Array<T>> {
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        //this.showAlert("cargarTodas", "Base de datos abierta");
        this.executeSql(this.getAllQuery(), []).then(
          (data) => {
            //this.showAlert("cargarTodas", "Sentencia ejecutada");
            var allItems = new Array();
            console.log("Sentencia ejecutada: ");
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                  var item = this.fromBD(data.rows.item(i));
                  allItems.push(item);
                }
            }
            //this.showAlert("getAll", "Devueltas: " + allItems.length);
            this.cerrar().then(() => {resolve(allItems);});
          }, (error) => {
            //this.showAlert("cargarTodas", "Error: " + error);
            console.error("Unable to execute sql: " + this.getAll(), error);
              this.cerrar().then(() => {resolve(false);});
          }
        );
      }, (error) => {
        console.error("[AbstractDao.cargarTodas] Error al abrir la base de datos abierta: " + error);
        this.cerrar().then(() => {reject(false);});
      });
    });

    return resul;
  }




  add(obj: T): Promise<any> {
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        var parametros = this.toBdAdd(obj);
        this.executeSql(this.addQuery(), parametros).
        then((ok) => {
            this.cerrar().then(() => resolve(true));
          },
          (error) => {
            this.cerrar().then(() => resolve(false));
          });

      }, (error) => {
        console.error("Unable to open database", error);
        this.cerrar().then(() => resolve(false));
      });

    });
    return resul;
  }


  protected abrir(): Promise<any> {
    return this.db.openDatabase({
      name: this.tableName() + ".db",
      location: "default"
    });
  }

  protected cerrar(): Promise<any> {
    return this.db.close();
  }

  protected executeSql(sentencia: string, parametros: any): Promise<any> {
    return this.db.executeSql(sentencia, parametros);
  }

}
