import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ColaboracionCiudadanaPage } from './colaboracion-ciudadana';

/**
  Dialogo de confirmacion
*/
@Component({
  templateUrl: 'dialogo-confirmacion.html',
})
export class DialogoConfirmacion {

  colaboracion: ColaboracionCiudadanaPage;

  direccion: string;
  telefono: string;
  correo: string;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.colaboracion = params.get("colaboracion");
    this.direccion = this.colaboracion.getDireccion();
    this.telefono = this.colaboracion.getTelefono();
    this.correo = this.colaboracion.getCorreo();
    console.log("[DialogoConfirmacion] direccion: " + this.direccion);
    console.log("[DialogoConfirmacion] telefono: " + this.telefono);
    console.log("[DialogoConfirmacion] correo: " + this.correo);
  }

  aceptar() {
    this.cerrar();
    this.colaboracion.confirmarEnvio();
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
