import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import {Platform} from 'ionic-angular';

import {Sitio} from '../../../dto/sitio/sitio';

import { AbstractDao } from '../abstract-dao';

import { UtilTipos } from '../../util-tipos';

import { ImagenesSqLite } from '../imagenes-sitio-sqlite/imagenes-sitio-sqlite';

/*
  Generated class for the SitiosSqLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SitiosSqLite extends AbstractDao<Sitio> {

  public static get TABLE_NAME(): string { return 'sitios'; }

  public static get CREATE_TABLE(): string {
    return "CREATE TABLE IF NOT EXISTS " + SitiosSqLite.TABLE_NAME +
      " (id INTEGER PRIMARY KEY, id_categoria INTEGER, nombre TEXT, poblacion TEXT, texto_corto1 TEXT," +
      " texto_corto2 TEXT, texto_corto3 TEXT, texto_largo1 TEXT, texto_largo2 TEXT, " +
      " latitud REAL, " +
      " longitud REAL, direccion TEXT, telefonos_fijos TEXT, telefonos_moviles TEXT, web TEXT, email TEXT, facebook TEXT," +
      " twitter TEXT, ranking INTEGER, favorito INTEGER, activo INTEGER, ultima_actualizacion NUMERIC )";
  }

  private static get ALL_COLUMNS(): string {
    return "id, id_categoria, nombre, poblacion, " +
      " texto_corto1, texto_corto2, texto_corto3, texto_largo1, texto_largo2, " +
      " latitud, " +
      " longitud, direccion, telefonos_fijos, telefonos_moviles, web, email, facebook, " +
      " twitter, ranking, favorito, activo, ultima_actualizacion "
      ;
  }

  private static get ADD(): string {
    return "INSERT INTO " + SitiosSqLite.TABLE_NAME +
      " ( " + SitiosSqLite.ALL_COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  }

  private static get GET_ALL(): string {
    return "SELECT " + SitiosSqLite.ALL_COLUMNS + " from " + SitiosSqLite.TABLE_NAME;
  }

  //private storage: Storage;

  constructor(private platform: Platform, private imagenesSqLite: ImagenesSqLite, private http: Http) {
    super();
  }

  public tableName(): string { return SitiosSqLite.TABLE_NAME; }
  public createTable(): string { return SitiosSqLite.CREATE_TABLE; }
  public allColumns(): string { return SitiosSqLite.ALL_COLUMNS; }
  public addQuery(): string { return SitiosSqLite.ADD; }
  public getAllQuery(): string { return SitiosSqLite.GET_ALL; }

  /*
  getAllSitios(): Promise<Array<Sitio>> {
    this.showAlert("SITIOS:", "getAll()");
    var resul = new Promise((resolve, reject) => {
      this.getAll().then((sitios) => {
        this.showAlert("SITIOS:", "getAll() Respuesta del padre");
        this.completarSitio(sitios, 0).then(
          () => resolve(true),
          (error) => resolve(false)
        );
      }, (error) => resolve(false));
    });
    return resul;
  }

  private completarSitio(sitios: Array<Sitio>, indice: number): Promise<any> {
    var resul = new Promise((resolve, reject) => {
      if(indice < sitios.length) {
        this.completarSitio(sitios, indice+1).then(() => {
          var sitio = sitios[indice];
          this.imagenesSqLite.getFromIdSitio(sitio.id).then(
            (imagenes) => {
              sitio.imagenes = new Array();
              for(var indImg=0; indImg<imagenes.length; indImg++) {
                var imagen = imagenes[indImg];
                imagen.isLogo ? (sitio.logotipo = imagen) : (sitio.imagenes.push(imagen));
              }
              resolve(true);
            }, (error) => resolve(false));
        });
      } else {
        resolve(true);
      }
    });
    return resul;

  }
  */

  fromBD(fila: any): Sitio {
    var resul = new Sitio();
    resul.id = fila.id;
    resul.idCategoria = fila.id_categoria;
    resul.nombre = fila.nombre;
    resul.poblacion = fila.poblacion;
    resul.textoCorto1 = fila.texto_corto1;
    resul.textoCorto2 = fila.texto_corto2;
    resul.textoCorto3 = fila.texto_corto3;
    resul.textoLargo1 = fila.texto_largo1;
    resul.textoLargo2 = fila.texto_largo2;
    resul.latitud = fila.latitud;
    resul.longitud = fila.longitud;
    resul.direccion = fila.direccion;
    resul.telefonosFijos = fila.telefonos_fijos;
    resul.telefonosMoviles = fila.telefonos_moviles;
    resul.web = fila.web;
    resul.email = fila.email;
    resul.facebook = fila.facebook;
    resul.twitter = fila.twitter;
    resul.ranking = fila.ranking;
    resul.favorito = UtilTipos.toBoolean(fila.favorito);
    resul.activo = UtilTipos.toBoolean(fila.activo);
    resul.ultimaActualizacion = new Date(fila.ultima_actualizacion);

    return resul;
  }

  toBdAdd(sitio: Sitio) {
    return this.toBD(sitio);
  }

  toBD(sitio: Sitio) {
    return [sitio.id, sitio.idCategoria, sitio.nombre, sitio.poblacion,
      sitio.textoCorto1, sitio.textoCorto2, sitio.textoCorto3, sitio.textoLargo1,
      sitio.textoLargo2, sitio.latitud, sitio.longitud, sitio.direccion,
      sitio.telefonosFijos, sitio.telefonosMoviles, sitio.web, sitio.email,
      sitio.facebook, sitio.twitter, sitio.ranking, UtilTipos.toNumber(sitio.favorito),
      UtilTipos.toNumber(sitio.activo), sitio.ultimaActualizacion.getTime()];
  }

}
