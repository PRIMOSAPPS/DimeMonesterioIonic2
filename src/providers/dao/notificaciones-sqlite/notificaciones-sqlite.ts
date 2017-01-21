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

  ////////////////////////////////////////////////
  constructor(private platform: Platform) {
    super();
  }

  public tableName(): string {return NotificacionesSqLite.TABLE_NAME;}
  public createTable(): string {return NotificacionesSqLite.CREATE_TABLE;}
  public allColumns(): string {return NotificacionesSqLite.ALL_COLUMNS;}
  public addQuery(): string {return NotificacionesSqLite.ADD;}
  public getAllQuery(): string {return NotificacionesSqLite.GET_ALL;}

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

  toBdAdd(notificacion: Notificacion) {
    return this.toBD(notificacion);
  }

  toBD(notificacion: Notificacion) {
    return [notificacion.id, notificacion.idCategoria, notificacion.titulo,
      notificacion.texto, notificacion.fechaInicioValidez.getTime(),
      notificacion.fechaFinValidez.getTime(), notificacion.ultimaActualizacion.getTime()];
  }

}
