import { Component } from '@angular/core';

import {NavController} from 'ionic-angular';

import {PreferenciasPage} from '../../pages/preferencias/preferencias';


/*
  Generated class for the Slider component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'mn-cabecera',
  templateUrl: 'cabecera.html',
})
export class Cabecera {

  constructor(public navCtrl: NavController) {
  }

  preferencias(event) {
    this.navCtrl.push(PreferenciasPage);
  }
}
