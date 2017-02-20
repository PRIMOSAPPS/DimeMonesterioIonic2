import { Injectable } from '@angular/core';

import {Platform} from 'ionic-angular';

import { Notificacion } from '../../../dto/notificacion/notificacion';

import { AbstractDao } from '../abstract-dao';

/*
  Generated class for the SitiosSqLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificacionesSqLite extends AbstractDao<Notificacion> {

  private static get TABLE_NAME(): string { return 'notificaciones'; }

  private static get CREATE_TABLE(): string {
    return "CREATE TABLE IF NOT EXISTS " + NotificacionesSqLite.TABLE_NAME +
      " (id INTEGER PRIMARY KEY, id_categoria INTEGER, titulo TEXT, texto TEXT, " +
      //"fecha_inicio_validez string, fecha_fin_validez string, ultima_actualizacion string )";
      "fecha_inicio_validez NUMERIC, fecha_fin_validez NUMERIC, ultima_actualizacion NUMERIC )";
  }

  private static get ALL_COLUMNS(): string {return "id, id_categoria, titulo, texto, " +
    "fecha_inicio_validez, fecha_fin_validez, ultima_actualizacion";}

  private static get ADD(): string {
    return "INSERT INTO " + NotificacionesSqLite.TABLE_NAME +
      " ( " + NotificacionesSqLite.ALL_COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?)";
  }

  private static get GET_ALL(): string {
    return "SELECT " + NotificacionesSqLite.ALL_COLUMNS + " from " + NotificacionesSqLite.TABLE_NAME;
  }

  private static get GET_DELETE_CADUCADAS(): string {
    var ahora = new Date();
    return "DELETE FROM " + NotificacionesSqLite.TABLE_NAME + " WHERE fecha_fin_validez < " + ahora.getTime();
  }

  ////////////////////////////////////////////////
  constructor(private platform: Platform) {
    super();
  }

  public tableName(): string {return NotificacionesSqLite.TABLE_NAME;}
  public createTable(): string {return NotificacionesSqLite.CREATE_TABLE;}
  public allColumns(): string {return NotificacionesSqLite.ALL_COLUMNS;}
  public addQuery(): string {return NotificacionesSqLite.ADD;}
  public getAllQuery(): string {return NotificacionesSqLite.GET_ALL;}
  public getByIdQuery(id: Number): string {
    return "SELECT " + NotificacionesSqLite.ALL_COLUMNS + " from " + NotificacionesSqLite.TABLE_NAME
    + " WHERE id = " + id;
  }
  public getByIdsQuery(ids: Array<Number>): string {
    return "SELECT " + NotificacionesSqLite.ALL_COLUMNS + " from " + NotificacionesSqLite.TABLE_NAME
    + " WHERE id in (" + ids.join() + ")";
  }

  fromBD(fila: any): Notificacion {
    var resul = new Notificacion();
    resul.id = fila.id;
    resul.idCategoria = fila.id_categoria;
    resul.titulo = fila.titulo;
    resul.texto = fila.texto;
    resul.fechaInicioValidez = new Date(fila.fecha_inicio_validez);
    resul.fechaFinValidez = new Date(fila.fecha_fin_validez);
    resul.ultimaActualizacion = new Date(fila.ultima_actualizacion);

    return resul;
  }

  borrarCaducadas(): Promise<any> {
    var resul = new Promise((resolve, reject) => {
      return this.abrir().then(
        () => {
          this.executeSql(NotificacionesSqLite.GET_DELETE_CADUCADAS, []).then(
            (b) => resolve(b),
            (error) => {
              console.error("[NotificacionesSqLite.borrarCaducadas] Error al borrar las notificaciones caducadas: " + error);
              this.cerrar().then(() => {reject(false);});
            });
        }, (error) => {
          console.error("[NotificacionesSqLite.borrarCaducadas] Error al abrir la base de datos abierta: " + error);
          this.cerrar().then(() => {reject(false);});
        }
      );
    });
    return resul;
  }

  getByIds(ids: Array<Number>): Promise<any> {
    var items = new Array();
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        var query = this.getByIdsQuery(ids);
        this.executeSql(query, []).then(
          (data) => {
            console.log("Sentencia ejecutada: " + query);
            for(var i=0; i<data.rows.length; i++) {
              var item = this.fromBD(data.rows.item(0));
              items.push(item);
            }
            this.cerrar().then(() => {resolve(items);});
          }, (error) => {
            console.error("Unable to execute sql: " + query, error);
            this.cerrar().then(() => {resolve(items);});
          }
        );
      }, (error) => {
        console.error("[AbstractDao.cargarTodas] Error al abrir la base de datos abierta: " + error);
        this.cerrar().then(() => {reject(items);});
      });
    });

    return resul;
  }

  getById(id: Number): Promise<any> {
    var item = null;
    var resul = new Promise((resolve, reject) => {
      this.abrir().then(() => {
        this.executeSql(this.getByIdQuery(id), []).then(
          (data) => {
            console.log("Sentencia ejecutada: ");
            if(data.rows.length > 0) {
              item = this.fromBD(data.rows.item(0));
            }
            this.cerrar().then(() => {resolve(item);});
          }, (error) => {
            console.error("Unable to execute sql: " + this.getByIdQuery(id), error);
            this.cerrar().then(() => {resolve(item);});
          }
        );
      }, (error) => {
        console.error("[AbstractDao.cargarTodas] Error al abrir la base de datos abierta: " + error);
        this.cerrar().then(() => {reject(item);});
      });
    });

    return resul;
  }

  toBdAdd(notificacion: Notificacion) {
    return this.toBD(notificacion);
  }

  toBD(notificacion: Notificacion) {
    return [notificacion.id, notificacion.idCategoria, notificacion.titulo,
      notificacion.texto, notificacion.fechaInicioValidez.getTime(),
      notificacion.fechaFinValidez.getTime(), notificacion.ultimaActualizacion.getTime()];
  }

}
