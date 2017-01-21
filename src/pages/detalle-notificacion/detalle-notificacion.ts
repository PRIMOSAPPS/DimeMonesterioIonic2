import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Notificacion } from '../../dto/notificacion/notificacion';

import { SafeHtml } from '@angular/platform-browser';

/*
  Generated class for the DetalleNotificacion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'detalle-notificacion.html'
})
export class DetalleNotificacionPage {

  notificacion: Notificacion;
  texto: SafeHtml;

  constructor(public navParams: NavParams) {
    this.notificacion = navParams.get('notificacion');
    this.texto = this.notificacion.texto;
  }

}
