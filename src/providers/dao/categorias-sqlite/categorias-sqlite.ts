import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
//import {StatusBar, SQLite} from 'ionic-native';
import {SQLite} from 'ionic-native';

/*
  Generated class for the SitiosSqLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategoriasSqLite {

  public static get TABLE_NAME(): string { return 'categorias'; }

  public db: SQLite;

  constructor(private platform: Platform) {
    this.db = new SQLite();
    this.crearBBDD();
  }

  public add() {
    this.db.executeSql("INSERT INTO " + CategoriasSqLite.TABLE_NAME + " (id, nombre, descripcion, nombre_icono, numero_sitios, ultima_actualizacion) " +
      " VALUES ('1', 'Prueba', 'Descr prueba', 'nombreIcono', 3, 234234)", []).then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error.err));
      });
  }

  public get() {
    this.db.executeSql("select * from " + CategoriasSqLite.TABLE_NAME, []).then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log("Leida una fila: " + data.rows.item(i).nombre);
          //this.people.push({ firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname });
        }
      }
    }, (error) => {
      console.log("ERROR: " + JSON.stringify(error.err));
    });
  }

  crearBBDD() {
    var sentencia = "CREATE TABLE IF NOT EXISTS " + CategoriasSqLite.TABLE_NAME +
      " (id INTEGER PRIMARY KEY, nombre TEXT, descripcion TEXT, nombre_icono TEXT, " +
      "numero_sitios NUMERIC, ultima_actualizacion NUMERIC )";

    this.platform.ready().then(() => {
      //StatusBar.styleDefault();
      //let db = new SQLite();
      this.db.openDatabase({
        name: CategoriasSqLite.TABLE_NAME + ".db",
        location: "default"
      }).then(() => {
        this.db.executeSql(sentencia, {}).then((data) => {
          console.log("TABLE CREATED: ", data);
        }, (error) => {
          console.error("Unable to execute sql", error);
        })
      }, (error) => {
        console.error("Unable to open database", error);
      });
    });
  }

}
