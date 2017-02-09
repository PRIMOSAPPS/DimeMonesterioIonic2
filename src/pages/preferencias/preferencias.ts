import {Component} from '@angular/core';

import {Preferencias} from '../../providers/preferencias/preferencias';

@Component({
  templateUrl: 'preferencias.html',
  providers: [Preferencias],
})
export class PreferenciasPage {

  vibrar: boolean;
  sonar: boolean;
  led: boolean;

  constructor(private pref: Preferencias) {
    this.vibrar=true;
    this.sonar=true;
    this.led=true;

    pref.getPrefVibrar().then((b) => {
      console.log("[PreferenciasPage] Valor almacenado de vibracion: " + this.vibrar);
      this.vibrar = b;
    },
    (m) => { console.error("[PreferenciasPage] Error al leer la preferencia de vibracion."); });

    pref.getPrefSonido().then((b) => {
      console.log("[PreferenciasPage] Valor almacenado de sonido: " + this.sonar);
      this.sonar = b;
    },
    (m) => { console.error("[PreferenciasPage] Error al leer la preferencia de sonido."); });

    pref.getPrefLed().then((b) => {
      console.log("[PreferenciasPage] Valor almacenado de led: " + this.led);
      this.led = b;
    },
    (m) => { console.error("[PreferenciasPage] Error al leer la preferencia de led."); });
  }

  public updateVibracion() {
    console.log("[PreferenciasPage] Nuevo valor de vibrar: " + this.vibrar);
    this.pref.setPrefVibrar(this.vibrar);
  }

  public updateSonido() {
    console.log("[PreferenciasPage] Nuevo valor de sonar: " + this.sonar);
    this.pref.setPrefSonido(this.sonar);
  }

  public updateLed() {
    console.log("[PreferenciasPage] Nuevo valor de led: " + this.led);
    this.pref.setPrefLed(this.led);
  }
}
