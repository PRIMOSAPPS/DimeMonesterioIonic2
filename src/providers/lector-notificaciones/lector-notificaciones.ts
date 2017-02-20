import { Http, Response } from '@angular/http';
//import { Injectable } from '@angular/core';

//import { Observable } from 'rxjs/Observable';
import {Observable} from 'rxjs/Rx';

import { Notificacion } from '../../dto/notificacion/notificacion';
import { NotificacionesSqLite } from '../dao/notificaciones-sqlite/notificaciones-sqlite';

import { Base64 } from '../base-64';
import { UtilFecha } from '../util-fecha';
import { Config } from '../../config/config';

//@Injectable()
export class LectorNotificaciones {

  constructor(private http: Http, private notificacionesSqLite: NotificacionesSqLite) {
  }

  cargarNotificacionesServidor() {
    var ultimaActualizacion = 0;
    var extra = "?ultima_actualizacion=" + ultimaActualizacion + "&version_app=2.0";
    //var url = Config.URL_NOTIFICACIOPNES_DESCARGABLES + extra;
    var url = Config.URL_NOTIFICACIONES_ACTIVAS + extra;

    console.log("[LectorNotificaciones] Se cargaran las notificaciones desde: " + url);
    return this.http.get(url)
          .map(res => res.json()).
          subscribe(data => this.tratarNotificacionesDescargables(data),
                err => this.handleError(err),
                () => console.log('Consutla terminada.'));
  }

  private tratarNotificacionesDescargables(res: Array<any>) {
    console.log("[LectorNotificaciones] Recibidas notificaciones");
    let notifDescargables = res;

    var gets = new Array();
    notifDescargables.forEach((notificacion) => {
      var extra = "?id_notificacion=" + notificacion.id + "&version_app=2.0";
      var url = Config.URL_NOTIFICACION + extra;

      var jsonObservable = this.http.get(url).map(res => res.json());
      gets.push(jsonObservable);

      /*
      this.http.get(url)
            .map(res => res.json()).
            subscribe(data => this.tratarNotificacion(data),
                  err => this.handleError(err),
                  () => console.log('Consulta terminada.'));
      */
    });

    var sourceGets = Observable.forkJoin(gets);
    var subscription = sourceGets.subscribe(
        x => {
          // x es un arry de arrays
          console.log("[sourceGets] tipo de x: " + (typeof x));
          console.log("[sourceGets] onNext: " + x);
          this.toBBDD(x);
        },
        e => console.log("[sourceGets] onError: " + e),
        () => console.log("[sourceGets] onCompleted")
      );
  }

  private toBBDD(notificaciones: Array<any>) {
    var notificacionesBBDD = this.toNotificaciones(notificaciones);

    this.p(notificacionesBBDD);

    /*
    var promesasExisten = new Array();
    for(var i=0; i<notificacionesBBDD.length; i++) {
      var notificacion = notificacionesBBDD[i];
      promesasExisten.push(this.notificacionesSqLite.getById(notificacion.id));
    }

    Promise.all(promesasExisten).then(
      (res) => {
        var nuevas = new Array();
        for(var j=0; j<res.length; j++) {
          if(res[j] == null) {
            nuevas.push(notificacionesBBDD[j]);
          }
        }
        console.log("Notificaciones nuevas: " + nuevas.length);
        this.addNuevasBBDD(nuevas);
      },
      (error) => console.error("Error al consultar si las notificaciones recibidas existen: " + error)
    );
    */
    ////////////////////////////////////////
    /*
    this.notificacionesSqLite.getById(notificacion.id).then((notif) => {
      if(notif != null) {
        this.notificacionesSqLite.add(notificacion);
      }
    });
    */
  }

  private getIds(notificaciones: Array<Notificacion>) : Array<Number> {
    var ids = new Array<Number>();
    for(var i=0; i<notificaciones.length; i++) {
      ids.push(notificaciones[i].id);
    }
    return ids;
  }

  /**
  Devuelve una lista de notificaciones que estan en notificaciones y no estan en
  notifBBDD
  */
  private getNuevas(notificaciones: Array<Notificacion>, notifBBDD: Array<Notificacion>) : Array<Notificacion> {
    var resul = new Array<Notificacion>();
    if(notificaciones.length > notifBBDD.length) {
      for(var i=0; i<notificaciones.length; i++) {
        var encontrada = false;
        var notif1 = notificaciones[i];
        for(var j=0; j<notifBBDD.length; j++) {
          if(notif1.id == notifBBDD[j].id) {
            encontrada = true;
            break;
          }
        }

        if(!encontrada) {
          resul.push(notif1);
        }
      }
    }
    console.log("[LectorNotificaciones.getNuevas] Entraron " + notificaciones.length
        + " notificaciones, salen " + resul.length);
    return resul;
  }

  private getNotificacionesNuevas(notificaciones: Array<Notificacion>) : Promise<any> {
    var resul = new Promise((resolve, reject) => {
        var ids = this.getIds(notificaciones);
        this.notificacionesSqLite.getByIds(ids).then(
          (notifBBDD) => {
            resolve(this.getNuevas(notificaciones, notifBBDD));
          },
          (error) => {
            reject("[LectorNotificaciones] Error consultando las notificaciones por ids");
          }
        );
      }
    );
    return resul;
  }

  private p(notificaciones: Array<any>) {
    this.getNotificacionesNuevas(notificaciones).then(
      (nuevas) => {
        if(nuevas.length > 0) {
          this.prueba(nuevas, 0);
        }
      },
      (error) => console.error(error)
    );
  }

  private prueba(notificaciones: Array<any>, contador) {
    console.log("[LectorNotificaciones] prueba contador = " + contador);
    if(contador < notificaciones.length) {
      var notificacion = notificaciones[contador];
      this.notificacionesSqLite.add(notificacion).then(
        (ok) => {
          var str = ok ? "OK" : "ERROR";
          console.log("[LectorNotificaciones] Resultado tras add: " + str);
          //if(ok) {
            contador++;
          //}
          this.prueba(notificaciones, contador);
        },
        (error) =>
          console.error("Error al aniadir la notificacion: " + notificacion.id)
      );
      /*
      this.notificacionesSqLite.getById(notificacion.id).then(
        (notif) => {
          if(notif == null) {
            this.notificacionesSqLite.add(notificacion).then(
              (ok) => this.prueba(notificaciones, ++contador),
              (error) =>
                console.error("Error al aniadir la notificacion: " + notificacion.id)
            );
          } else {
            this.prueba(notificaciones, ++contador);
          }
        }, (error) => {
          console.error("Error al consultar la notificacion: " + notificacion.id);
          this.prueba(notificaciones, ++contador);
        }
      );
      */
    }
  }

  private pruebaBorrar(notificaciones: Array<any>, contador) {
    if(contador < notificaciones.length) {
      var notificacion = notificaciones[contador];
      this.notificacionesSqLite.getById(notificacion.id).then(
        (notif) => {
          if(notif == null) {
            this.notificacionesSqLite.add(notificacion).then(
              (ok) => this.pruebaBorrar(notificaciones, ++contador),
              (error) =>
                console.error("Error al aniadir la notificacion: " + notificacion.id)
            );
          } else {
            this.pruebaBorrar(notificaciones, ++contador);
          }
        }, (error) => {
          console.error("Error al consultar la notificacion: " + notificacion.id);
          this.pruebaBorrar(notificaciones, ++contador);
        }
      );
    }
  }

  private getExistentes(notificaciones: Array<any>, contador) : Array<Notificacion> {
    var resul = new Array();

    if(contador < notificaciones.length) {
      var notificacion = notificaciones[contador];
      this.notificacionesSqLite.getById(notificacion.id).then(
        (notif) => {
          resul = this.getExistentes(notificaciones, ++contador);
          if(notif != null) {
            resul.push(notif);
          }
        }, (error) => console.error("Error al consultar la notificacion: " + notificacion.id)
      );
    }

    return resul;
  }

  private addNuevasBBDD(notificaciones: Array<any>) {
    this.addNuevaBBDD(notificaciones, 0);
  }

  private addNuevaBBDD(notificaciones: Array<any>, contador) {
    if(contador < notificaciones.length) {
      var notificacion = notificaciones[contador];
      this.notificacionesSqLite.add(notificacion).then(
        (ok) => this.addNuevaBBDD(notificaciones, ++contador),
        (error) => console.error("Se ha producido un error al crear una notificacion")
      );
    }
  }

  private toNotificaciones(notificaciones: Array<Array<any>>): Array<Notificacion> {
    var resul = new Array();

    for(var i=0; i<notificaciones.length; i++) {
      var notificacion = this.createNotificacion(notificaciones[i][0]);
      resul.push(notificacion);
    }

    return resul;
  }

  private createNotificacion(notif: any): Notificacion {
    var notificacion = new Notificacion();
    notificacion.id = notif.id;
    notificacion.idCategoria = notif.id_categoria;
    notificacion.titulo = Base64.decode(notif.titulo);
    notificacion.texto = Base64.decode(notif.texto);
    notificacion.fechaInicioValidez = new Date(UtilFecha.toISO(notif.fecha_envio));
    notificacion.fechaFinValidez = new Date(UtilFecha.toISO(notif.fecha_caducidad));
    notificacion.ultimaActualizacion = new Date(UtilFecha.toISO(notif.ultima_actualizacion));
    console.log("notif.fecha_caducidad " + notif.fecha_caducidad + " --- UtilFecha.toISO(notif.fecha_caducidad) "
      + UtilFecha.toISO(notif.fecha_caducidad));
    console.log("Notificacion con id " + notificacion.id + " y fecha de caducidad "
      + notificacion.fechaFinValidez.toUTCString());
    //notificacion.fechaInicioValidez = new Date(notif.fecha_envio);
    //notificacion.fechaFinValidez = new Date(notif.fecha_caducidad);
    //notificacion.ultimaActualizacion = new Date(notif.ultima_actualizacion);

    return notificacion;
  }

/*
  private tratarNotificacion(notif: any) {
    if(notif && notif.length > 0) {
      notif = notif[0];
      console.log("[LectorNotificaciones] Recibida una notificacion");
      //{ "id": 129, "id_categoria": 1, "titulo": "", "texto": "", "fecha_caducidad": "9-11-2016 23:59:59", "fecha_inicio_validez": null, "fecha_fin_validez": null, "fecha_envio": "19-10-2016 18:31:52", "fecha_expiracion": null, "ultima_actualizacion": "19-10-2016 18:31:52" },

      var notificacion = new Notificacion();
      notificacion.id = notif.id;
      notificacion.idCategoria = notif.id_categoria;
      notificacion.titulo = Base64.decode(notif.titulo);
      notificacion.texto = Base64.decode(notif.texto);
//      notificacion.fechaInicioValidez = new Date(UtilFecha.toISO(notif.fecha_envio));
//      notificacion.fechaFinValidez = new Date(UtilFecha.toISO(notif.fecha_caducidad));
//      notificacion.ultimaActualizacion = new Date(UtilFecha.toISO(notif.ultima_actualizacion));
      notificacion.fechaInicioValidez = new Date(notif.fecha_envio);
      notificacion.fechaFinValidez = new Date(notif.fecha_caducidad);
      notificacion.ultimaActualizacion = new Date(notif.ultima_actualizacion);

      this.notificacionesSqLite.getById(notificacion.id).then((notif) => {
        if(notif != null) {
          this.notificacionesSqLite.add(notificacion);
        }
      });
    }
  }
*/

  private handleError(error: Response | any) {
    console.log("[LectorNotificaciones] ERROR");
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
