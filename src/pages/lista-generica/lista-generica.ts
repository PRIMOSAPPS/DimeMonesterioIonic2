import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ListaGenerica page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-lista-generica',
  templateUrl: 'lista-generica.html'
})
export class ListaGenerica {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ListaGenerica Page');
  }

}
