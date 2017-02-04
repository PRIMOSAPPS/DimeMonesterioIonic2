import { Component } from '@angular/core';

import {Gps, GpsListener} from '../../providers/gps';
import { MapsGoogleApis } from '../../providers/mapsgoogleapis/mapsgoogleapis';
import {Camara} from '../../providers/camara/camara';
import { MailSender } from '../../providers/mail-sender/mailsender';
import { MailContentDto } from '../../providers/mail-sender/mailcontent-dto';
import { ImagenMailDto } from '../../providers/mail-sender/imagenmail-dto';

import { ModalController, AlertController } from 'ionic-angular';

import { DialogoSlider } from './dialogo-slider';
import { DialogoConfirmacion } from './dialogo-confirmacion';
import { DialogoSinDireccion } from './dialogo-sindireccion';

import { Config } from '../../config/config';

export {DialogoSlider, DialogoSinDireccion, DialogoConfirmacion}

/*
  Generated class for the ColaboracionCiudadanaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'colaboracion-ciudadana.html',
  providers: [Camara, MailSender, Gps, MapsGoogleApis]
})
export class ColaboracionCiudadanaPage implements GpsListener {

  private direccionCalculada: boolean;
  direccion: string;
  telefono: string;
  correo: string;
  seleccionColaboracion: string;
  seleccionResiduos: string;

  fotosRealizadas: Array<string>;

  opcionesPrincipales: Array<string>;
  opcionesResiduos: Array<string>;

  opcionAlumbrado: string;
  opcionRecogidaResiduos: string;

  comentario: string;

  private idGpsListener: number;
  //private gps: Gps;

  constructor(public modalCtrl: ModalController, public camara: Camara, private alertCtrl: AlertController,
      private mailSender: MailSender, private gps: Gps) {
    this.direccion = "Dirección no calculada";
    this.telefono = "666555444";
    this.correo = "dsfdf@gmail.com";

    this.opcionAlumbrado = 'Alumbrado público';
    this.opcionRecogidaResiduos = 'Recogida de residuos';

    this.seleccionColaboracion = this.opcionAlumbrado;
    this.seleccionResiduos = 'Residuos orgánicos';

    this.fotosRealizadas = new Array();

    this.comentario = "";

    this.opcionesPrincipales = ['Parques y jardines', 'Alcantarillado', 'Averías de agua',
      'Limpieza viaria', 'Señalización vial / tráfico', 'Acerados / pavimentos',
      'Fachadas y pintadas', 'Mobiliario urbano', 'Ferias y fiestas', 'Otras incidencias'];

    this.opcionesResiduos = [this.seleccionResiduos, 'Papel / cartón', 'Vidrio',
      'Plásticos'];

    //this.gps = new Gps();
    this.gps.addListener(this);
  }

  sacarFoto() {

    console.log("Vamos a sacar una foto.");
    //var urlFoto = "img/slide00" + (this.fotosRealizadas.length +1) + ".jpg";
    //this.fotosRealizadas.push(urlFoto);
    this.camara.sacarFotoCamera().then(
    //this.camara.sacarFoto().then(
      (imagen) => {
        console.log("Sacada foto.");
        this.fotosRealizadas.push(Config.DATA_IMAGE_JPG_BASE64 + imagen);
        //this.fotosRealizadas.push(imagen);
      },
      (error) => console.log("Error al sacar la foto: " + error)
    );

    console.log("Pulsado: sacarFoto");
  }

  mostrarSlider(foto) {
    let profileModal = this.modalCtrl.create(DialogoSlider, {imagenes: this.fotosRealizadas});
    profileModal.present();
  }

  private borradoFotoConfirmado(foto) {
    console.log("Se tiene que borrar: " + foto);
    this.alertCtrl.create
    for(var i=0; i<this.fotosRealizadas.length; i++) {
      if(this.fotosRealizadas[i] === foto) {
        this.fotosRealizadas.splice(i, 1);
        break;
      }
    }
  }

  borrarFoto(foto) {
    let dialogo = this.alertCtrl.create({
      title: 'Borrar foto',
      message: "¿Confirma que desea borrar la foto?",
      buttons: [
        {
          text: 'Si',
          handler: data => {
            console.log('Cancel clicked');
            this.borradoFotoConfirmado(foto);
          }
        },
        {
          text: 'No',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    dialogo.present();
  }

  enviar() {
    console.log("Pulsado: enviar");
    if(this.direccionCalculada == null) {
      console.log("direccuion es null: " + this.direccionCalculada);
      this.preguntarDireccion();
    } else {
      console.log("direccuion NO es null: " + this.direccionCalculada);
      this.mostrarDialogoConfirmarEnvio();
    }
  }

  preguntarDireccion() {
    let profileModal = this.modalCtrl.create(DialogoSinDireccion, {colaboracion: this});
    profileModal.present();
  }

  mostrarDialogoConfirmarEnvio() {
    let profileModal = this.modalCtrl.create(DialogoConfirmacion, {colaboracion: this});
    profileModal.present();
  }

  confirmarEnvio() {
    console.log("Envio confirmado");
    var contenidoMail = this.crearMensajeMailDto();
    this.mailSender.enviarMail(contenidoMail);
  }

  private crearMensajeMailDto(): MailContentDto {
    var resul = new MailContentDto();
    resul.telefono = this.telefono;
    resul.correo = this.correo;
    resul.direccion = this.direccion;
    resul.tipo = this.getTipoMensaje();
    resul.comentario = this.comentario;
    resul.imagenes = new Array();
    for(var i=0; i<this.fotosRealizadas.length; i++) {
      var imagen = new ImagenMailDto();
      imagen.nombre = "Imagen_" + i + ".jpg";
      imagen.imagen = this.fotosRealizadas[i];
      resul.imagenes.push(imagen);
    }

    return resul;
  }

  private getTipoMensaje(): string {
    var resul = this.seleccionColaboracion;
    if(resul === this.opcionRecogidaResiduos) {
      resul = this.seleccionResiduos;
    }
    return resul;
  }

  // Metodos de la interfaz GpsListener
  nuevaPosicion(direccion) {
    console.log("recibida una direccion: " + direccion);
    this.direccion = direccion;
    this.direccionCalculada = true;
  }

  getId(): number {
    return this.idGpsListener;
  }

  setId(id: number) {
    this.idGpsListener = id;
  }
  /////////////////////////////////////

  getDireccion() {
    return this.direccion;
  }

  getTelefono() {
    return this.telefono;
  }

  getCorreo() {
    return this.correo;
  }

  setDireccion(direccion: string) {
    console.log("Asignando la direccion: " + direccion);
    this.direccion = direccion;
  }
}
