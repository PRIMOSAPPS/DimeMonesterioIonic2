import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams } from 'ionic-angular';

import { Sitio } from '../../dto/sitio/sitio';
import { Imagen } from '../../dto/imagen/imagen';

import { ImagenesSqLite } from '../../providers/dao/imagenes-sitio-sqlite/imagenes-sitio-sqlite';

import { SafeHtml } from '@angular/platform-browser';

/*
  Generated class for the DetalleSitioPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'detalle-sitio.html',
  providers: [ImagenesSqLite],
})
export class DetalleSitioPage {
  opcionesSlider = {
    //effect: 'fade',
    autoplay: 5000,
    autoplayDisableOnInteraction: false,
    loop: true,
    speed: 500,
    //pager: true
  };

  sitio: Sitio;
  imagenes: Array<string>;

  telefonos: string;
  telefonoLlamada: string;
  urlCompartir: string;
  urlMail: string;
  textoLargo: SafeHtml;

  constructor(navParams: NavParams, private http: Http, private imagenesSqLite: ImagenesSqLite) {
    this.imagenes = new Array();
    this.sitio = navParams.get('sitio');

    this.imagenesSqLite.getFromIdSitio(this.sitio.id).then(
      (imagenes) => {this.asignarImagenes(imagenes);},
      (error) => console.log("[DetalleSitioPage] constructor-Error: " + error)
    );

    this.asignarTextoLargo();
    this.asignarTelefonos();
    this.asignarUrlCompartir();
    this.asignarUrlMail();
  }

  abrirMapa() {
    window.open("geo:" + this.sitio.latitud + "," + this.sitio.longitud);
  }

  asignarUrlMail() {
    this.urlMail = "mailto:" + this.sitio.email;
  }

  asignarUrlCompartir() {
    this.urlCompartir = "http://maps.google.com/maps?q=" + this.sitio.latitud + "," + this.sitio.longitud;
  }

  asignarTextoLargo() {
    this.textoLargo = this.sitio.textoLargo1 + this.sitio.textoLargo2;
  }

  asignarImagenes(imagenes) {
    for(var i=0; i<imagenes.length; i++) {
      this.asignarImagen(imagenes[i]);
    }
  }

  asignarImagen(imagen: Imagen) {
    console.log("Imagen a asignar: " + imagen);
    if (imagen != null) {
      this.imagenes.push(imagen.imagen);
    }
  }

  asignarTelefonos() {
    this.telefonos = "";
    this.telefonoLlamada = "";
    if (this.sitio.telefonosFijos != "" && this.sitio.telefonosMoviles != "") {
      this.telefonos = this.sitio.telefonosFijos + " / " + this.sitio.telefonosMoviles;
      this.telefonoLlamada = this.sitio.telefonosFijos;
    } else if (this.sitio.telefonosFijos != "") {
      this.telefonos = this.sitio.telefonosFijos;
      this.telefonoLlamada = this.sitio.telefonosFijos;
    } else if (this.sitio.telefonosMoviles != "") {
      this.telefonos = this.sitio.telefonosMoviles;
      this.telefonoLlamada = this.sitio.telefonosMoviles;
    }
  }

  fromBase64(t: string) {
    return decodeURIComponent(Array.prototype.map.call(atob(t), function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
  }

}
