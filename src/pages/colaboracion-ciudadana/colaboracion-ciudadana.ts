import { Component } from '@angular/core';

import {Gps, GpsListener} from '../../providers/gps';
import {Camara} from '../../providers/camara/camara';
import { MailSender } from '../../providers/mail-sender/mailsender';
import { MailContentDto } from '../../providers/mail-sender/mailcontent-dto';
import { ImagenMailDto } from '../../providers/mail-sender/imagenmail-dto';

import { ModalController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { File } from 'ionic-native';

/*
  Generated class for the ColaboracionCiudadanaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'colaboracion-ciudadana.html',
  providers: [Camara, MailSender]
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
  private gps: Gps;

  constructor(public modalCtrl: ModalController, public camara: Camara, private alertCtrl: AlertController,
      private mailSender: MailSender) {
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

    this.gps = new Gps();
    this.gps.addListener(this);
  }

  sacarFoto() {

    //var urlFoto = "img/slide00" + (this.fotosRealizadas.length +1) + ".jpg";
    //this.fotosRealizadas.push(urlFoto);
    this.camara.sacarFotoCamera().then(
      (urlFoto) => {
        console.log("Sacada foto: " + urlFoto);
        this.fotosRealizadas.push(urlFoto);
      },
      (error) => console.log("Error al sacar la foto: " + error)
    );


    /*
    Camera.getPicture({
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {

      let alert = this.alertCtrl.create({
        title: 'Low battery',
        subTitle: err,
        buttons: ['Dismiss']
      });
      alert.present();
      // Handle error
    });
    */
    console.log("Pulsado: sacarFoto");
    this.camara.sacarFoto().then();
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
      imagen.nombre = this.fotosRealizadas[i];
      imagen.imagen = "Relleno";
      var nombreFile = imagen.nombre.split(/[\\/]/).pop();
      var pathFile = imagen.nombre.substring(0, imagen.nombre.length - nombreFile.length);
      var nombreCompleto = pathFile + nombreFile;
      File.checkFile(pathFile, nombreFile).then(
        () => {
          File.readAsBinaryString(pathFile, nombreFile).then(
            (data) => console.log("leido el fichero: " + nombreCompleto + ": " + data),
            (error) => {console.error("Error al leer el fichero: " + nombreCompleto + " -- " + error)}
          );
        },
        (error) => {console.error("Error al leer el fichero: " + nombreCompleto + " -- " + error)}
      );
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
  nuevaPosicion(posicion) {
    console.log("recibida una direccion.");
    this.direccion = "Tenemos direccion :)";
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

/**
Dialogo modal para ampliar las fotos realizadas
*/
@Component({
  templateUrl: 'dialogo-slider.html',
})
export class DialogoSlider {

  myOptions = {
    //effect: 'fade',
    //autoplay: 500,
    //autoplayDisableOnInteraction: false,
    loop: false,
    //speed: 500,
    pager: true
  };

  claseSlider: string;

  imagenesSlider: Array<string>;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.imagenesSlider = params.get("imagenes");
    this.claseSlider = "fondoSlider";
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
