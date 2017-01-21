import {Component} from '@angular/core';

@Component({
  templateUrl: 'preferencias.html',
})
export class PreferenciasPage {

  vibrar: boolean;
  sonar: boolean;
  led: boolean;

  constructor() {
    this.vibrar=true;
    this.sonar=true;
    this.led=true;
  }
}
