import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

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
