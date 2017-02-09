import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DetalleNotificacionPage } from '../detalle-notificacion/detalle-notificacion';

import { NotificacionesSqLite } from '../../providers/dao/notificaciones-sqlite/notificaciones-sqlite';

import { AlertController } from 'ionic-angular';

/*
  Generated class for the ListPuntosInteresPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'notificaciones.html',
  providers: [NotificacionesSqLite],
})
export class NotificacionesPage {

  notificaciones: Array<any>;

  constructor(private navCtrl: NavController, private notificacionesSqLite : NotificacionesSqLite,
  private alertCtrl: AlertController) {
    this.notificaciones = new Array();

    this.notificacionesSqLite.borrarCaducadas().then(
      d => this.cargar(),
      error =>  this.cargar()
    );
  }

  cargar() {
//    this.showAlert("cargar", "Se cargan las notificaciones.");
    this.notificacionesSqLite.getAll().then(
      (notificaciones) => {this.notificaciones = notificaciones;},
      //(error) => {this.showAlert("cargar", "Error al cargar las notificaciones: " + error);}
    ).catch((ex) => {this.showAlert("cargar", "Excepcion al cargar las notificaciones: " + ex);});
  }

  notificacionSeleccionada(event, notificacion) {
    this.navCtrl.setRoot(DetalleNotificacionPage, {
      notificacion: notificacion
    });
  }

  showAlert(texto1: string, texto2: string) {
    let alert = this.alertCtrl.create({
      title: texto1,
      subTitle: texto2,
      buttons: ['OK']
    });
    alert.present();
  }

}
