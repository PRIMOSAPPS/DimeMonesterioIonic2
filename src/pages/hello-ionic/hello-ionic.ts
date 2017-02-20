import {Component} from '@angular/core';

//import { Page } from 'ionic-framework/ionic';
//import { Page } from 'ionic-angular';

//import {CategoriasSqLite} from '../../providers/dao/categorias-sqlite/categorias-sqlite';

import {Platform} from 'ionic-angular';

//import { AlertController } from 'ionic-angular';
//import { ModalController, NavParams } from 'ionic-angular';

import { Config } from '../../config/config';


@Component({
  templateUrl: 'hello-ionic.html',
})
export class HelloIonicPage {
	myOptions = {
		effect: 'fade',
		autoplay: 4000,
		autoplayDisableOnInteraction: false,
		loop: true,
		speed: 1000,
		//pager: true
	};

  claseSlider: string;

  imagenesSlider: Array<string>;

	constructor(platform: Platform) { //}, public alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.claseSlider = "fondoCompleto";
    this.imagenesSlider = Config.IMAGENES_SLIDER;

    var pls0 = platform.platforms();
    for(var i=0; i<pls0.length; i++) {
      var pl = pls0[i];
      console.log("Plataforma existente: " + pl);
    }
    var pls = ["android", "browser", "ios", "windows"];
    for(var i=0; i<pls.length; i++) {
      var pl = pls[i];
      console.log("Plataforma es: " + pl + ": " + platform.is(pl));
    }

    //this.showPrompt();
    //this.presentProfileModal();


    //var categoriasSqLite = new SitiosSqLite(platform);

    //this.categoriasSqLite.add();
    //this.categoriasSqLite.get();
	}

  ////////////////////////
  /*
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  presentProfileModal() {
   let profileModal = this.modalCtrl.create(Profile);
   profileModal.present();
 }
 */
  ////////////////////////

}

/*
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Login</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>Hello World</ion-content>`

})
export class Profile {

  constructor() {}

}
*/
