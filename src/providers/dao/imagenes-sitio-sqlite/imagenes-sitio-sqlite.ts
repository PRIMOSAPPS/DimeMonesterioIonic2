import { Injectable } from '@angular/core';

import {Platform} from 'ionic-angular';

import { Imagen } from '../../../dto/imagen/imagen';

import { AbstractDao } from '../abstract-dao';

import { UtilTipos } from '../../util-tipos';

/*
  Generated class for the SitiosSqLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImagenesSqLite extends AbstractDao<Imagen> {

  private static get TABLE_NAME(): string { return 'imagenes'; }

  private static get CREATE_TABLE(): string {
    return "CREATE TABLE IF NOT EXISTS " + ImagenesSqLite.TABLE_NAME +
      " (id INTEGER PRIMARY KEY AUTOINCREMENT, id_sitio NUMERIC, nombre TEXT, islogo NUMERIC, imagen TEXT)";
  }

  private static get COLUMNS_INSERT(): string {return "id_sitio, nombre, islogo, imagen";}
  private static get ALL_COLUMNS(): string {return "id, " + ImagenesSqLite.COLUMNS_INSERT;}

  private static get ADD(): string {
    return "INSERT INTO " + ImagenesSqLite.TABLE_NAME +
      " ( " + ImagenesSqLite.COLUMNS_INSERT + ") VALUES (?, ?, ?, ?)";
  }

  private static get GET_ALL(): string {
    return "SELECT " + ImagenesSqLite.ALL_COLUMNS + " from " + ImagenesSqLite.TABLE_NAME;
  }


  private static get BY_ID_SITIO(): string {
    return "SELECT " + ImagenesSqLite.ALL_COLUMNS + " from " + ImagenesSqLite.TABLE_NAME + " where id_sitio=?";
  }

  ////////////////////////////////////////////////
  constructor(private platform: Platform) {
    super();
  }

  public tableName(): string {return ImagenesSqLite.TABLE_NAME;}
  public createTable(): string {return ImagenesSqLite.CREATE_TABLE;}
  public allColumns(): string {return ImagenesSqLite.ALL_COLUMNS;}
  public addQuery(): string {return ImagenesSqLite.ADD;}
  public getAllQuery(): string {return ImagenesSqLite.GET_ALL;}

  getFromIdSitio(idSitio: number): Promise<Array<Imagen>> {
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        this.executeSql(ImagenesSqLite.BY_ID_SITIO, [idSitio]).then(
          (data) => {
            var allItems = new Array();
            console.log("Sentencia ejecutada: ");
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                  var item = this.fromBD(data.rows.item(i));
                  allItems.push(item);
                }
            }
            this.cerrar().then(() => {resolve(allItems);});
          }, (error) => {
            console.error("Unable to execute sql: " + this.getAll(), error);
              this.cerrar().then(() => {resolve(false);});
          }
        );
      }, (error) => {
        console.error("[ImagenesSqLite.getFromIdSitio] Error al abrir la base de datos abierta: " + error);
        this.cerrar().then(() => {reject(false);});
      });
    });

    return resul;
  }

  fromBD(fila: any): Imagen {
    var resul = new Imagen();
    resul.id = fila.id;
    resul.idSitio = fila.id_sitio;
    resul.nombre = fila.nombre;
    resul.isLogo = UtilTipos.toBoolean(fila.islogo);
    resul.imagen = fila.imagen;

    return resul;
  }

  toBD(imagen: Imagen) {
    return [imagen.id, imagen.idSitio, imagen.nombre, UtilTipos.toNumber(imagen.isLogo),
      imagen.imagen];
  }

  toBdAdd(imagen: Imagen) {
    return [imagen.idSitio, imagen.nombre, UtilTipos.toNumber(imagen.isLogo),
      imagen.imagen];
  }

}
