import { Http, Response } from '@angular/http';
//import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

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
    var url = Config.URL_NOTIFICACIOPNES_DESCARGABLES + extra;

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

    notifDescargables.forEach((notificacion) => {
      var extra = "?id_notificacion=" + notificacion.id + "&version_app=2.0";
      var url = Config.URL_NOTIFICACION + extra;
      this.http.get(url)
            .map(res => res.json()).
            subscribe(data => this.tratarNotificacion(data),
                  err => this.handleError(err),
                  () => console.log('Consulta terminada.'));
    });
  }

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
      notificacion.fechaInicioValidez = new Date(UtilFecha.toISO(notif.fecha_envio));
      notificacion.fechaFinValidez = new Date(UtilFecha.toISO(notif.fecha_caducidad));
      notificacion.ultimaActualizacion = new Date(UtilFecha.toISO(notif.ultima_actualizacion));
      this.notificacionesSqLite.add(notificacion);
    }
  }

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
