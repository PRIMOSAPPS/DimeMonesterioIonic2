import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ColaboracionCiudadanaPage } from './colaboracion-ciudadana';

/**
  Dialogo para preguntar la direccion sino se ha conseguido
*/
@Component({
  templateUrl: 'dialogo-sin-direccion.html',
})
export class DialogoSinDireccion {

  colaboracion: ColaboracionCiudadanaPage;
  direccion: string;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.direccion = "Prueba";
    this.colaboracion = params.get("colaboracion");
  }

  aceptar() {
    console.log("Se ha aceptado la direccion: " + this.direccion);
    this.cerrar();
    this.colaboracion.setDireccion(this.direccion);
    this.colaboracion.mostrarDialogoConfirmarEnvio();
  }

  cerrar() {
    console.log("Se cierra el dialogo para pedir la direccion.");
    this.viewCtrl.dismiss();
  }

}
