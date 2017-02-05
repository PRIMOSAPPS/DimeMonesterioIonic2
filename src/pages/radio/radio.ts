import {Component} from '@angular/core';

//import {MediaPlugin} from 'ionic-native';

import {RadioPlayer} from '../../providers/radioplayer';

import {Config} from '../../config/config';


@Component({
  templateUrl: 'radio.html',
  //directives: [MiSlider, Cabecera]
})
export class RadioPage {
  myOptions = {
    //effect: 'fade',
    autoplay: 500,
    autoplayDisableOnInteraction: false,
    loop: true,
    speed: 500,
    //pager: true
  };

  radio: RadioPlayer;
  claseSlider: string;
  mensajeErrorReproduccion: string;
  errorReproduccion: boolean = false;
  reproduciendo: boolean = false;

  imagenesSlider: Array<string>;

  constructor() {
    console.log("Empezando.........................");
    this.claseSlider = "fondoCompleto";
    this.mensajeErrorReproduccion = "No ha sido posible conectar con la emisión de la radio.";

    this.imagenesSlider = Config.IMAGENES_SLIDER;

    this.radio = new RadioPlayer(Config.URL_RADIO);
    //this.play();
  }

  reproduccionCorrecta() {
    console.log("reproduccionCorrecta");
    this.reproduciendo = true;
    this.errorReproduccion = false;
  }

  error() {
    console.log("error reproduccion");
    this.reproduciendo = false;
    this.errorReproduccion = true;
  }

  playPause() {
    this.reproduciendo ? this.pause() : this.play();
  }

  masVolumen() {
    this.radio.masVolumen();
  }

  menosVolumen() {
    this.radio.menosVolumen();
  }

  play() {
    this.radio.play(() => {this.reproduccionCorrecta();}, () => {this.error();});
  };

  pause() {
    this.radio.pause();
    this.reproduciendo = false;
  };

  ionViewDidEnter() {
    console.log("[ionViewDidEnter] ...");
    this.play();
  };

  ionViewDidLeave() {
    console.log("[ionViewDidLeave] ...");
    this.pause();
  };

}
