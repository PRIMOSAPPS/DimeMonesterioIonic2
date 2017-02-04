import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//import { Storage, SqlStorage } from 'ionic-framework/ionic';
import { Storage } from '@ionic/storage';

import { Notificacion } from '../dto/notificacion/notificacion';

import { NotificacionesSqLite } from '../providers/dao/notificaciones-sqlite/notificaciones-sqlite';
import { SitiosSqLite } from '../providers/dao/sitios-sq-lite/sitios-sq-lite';
import { ImagenesSqLite } from '../providers/dao/imagenes-sitio-sqlite/imagenes-sitio-sqlite';

import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';

import {ColaboracionCiudadanaPage} from '../pages/colaboracion-ciudadana/colaboracion-ciudadana';
import {ListPuntosInteresPage} from '../pages/list-puntos-interes/list-puntos-interes';

import {RadioPage} from '../pages/radio/radio';

import {NotificacionesPage} from '../pages/notificaciones/notificaciones';

import { Http } from '@angular/http';
import {Config} from '../config/config';

import { LectorNotificaciones } from '../providers/lector-notificaciones/lector-notificaciones';
import { LectorSitios } from '../providers/lector-sitios/lector-sitios';

//import { Push, PushToken } from '@ionic/cloud-angular';

import { UtilFecha } from '../providers/util-fecha';

declare var FCMPlugin:any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HelloIonicPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private http: Http,
    private storage: Storage,
    //private push: Push,
    //private notificacionesSqLite: NotificacionesSqLite
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Puntos de interés', component: ListPuntosInteresPage },
      { title: 'Colaboración ciudadana', component: ColaboracionCiudadanaPage },
      { title: 'Radio', component: RadioPage },
      { title: 'Bandos', component: NotificacionesPage },
      //{ title: 'HelloIonicPage', component: HelloIonicPage },
      //{ title: 'List', component: ListPage },
    ];

  }

  private static get PRIMER_ARRANQUE() { return "primer-arranque"; };


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      Config.init(this.http).subscribe(
        data => {
          console.log("[App] Finalizada la carga de la configuracion: " + Config.URL_RADIO);
          //this.storage.set(MyApp.PRIMER_ARRANQUE, "true");
          var primerArranque = this.storage.get(MyApp.PRIMER_ARRANQUE);
          primerArranque
            .then(
            (res) => {
              console.log("Es el primer arranque: " + res);
              if (res != "false") {
                console.log("Si que es el primer arranque: " + res);
                this.accionesPrimerArranque();
              }
            },
            (err) => { console.log("ERROR LEYENDO LOCALSTORAGE: " + MyApp.PRIMER_ARRANQUE); })
            .catch((err) => { console.log("Error leyendo la variable " + MyApp.PRIMER_ARRANQUE); });

          //this.registerPushNotifications();

          this.registrarFirebase();
        }
      );
    });
  }

  registrarFirebase() {
    FCMPlugin.subscribeToTopic('allDevices');

    FCMPlugin.onTokenRefresh(function(token){
      console.log("[FCMPlugin.onTokenRefresh] " + token );
    });

    FCMPlugin.onNotification(function(data){
      if(data.wasTapped){
        //Notification was received on device tray and tapped by the user.
        console.log("[FCMPlugin.onNotification data.wasTapped] " + JSON.stringify(data) );
      }else{
        //Notification was received in foreground. Maybe the user needs to be notified.
        console.log("[FCMPlugin.onNotification NO data.wasTapped] " + JSON.stringify(data) );
      }
  });
  }

  /*
  registerPushNotifications() {
    console.log("[registerPushNotifications]");

    this.push.register().then((t: PushToken) => {
      console.log("[registerPushNotifications] Notificacion recibida: " + t);
      let saveOptions = { ignore_user: true };
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      });

    this.push.rx.notification()
    .subscribe((msg) => {
      console.log("[registerPushNotifications] this.ppush.rx.notification: " + JSON.stringify(msg));

      var datos = msg.raw.additionalData;

      var notificacion = new Notificacion();
      notificacion.id = datos["id"];
      notificacion.idCategoria = datos["id_categoria"];
      notificacion.titulo = datos["titulo"];
      notificacion.texto = datos["texto"];
      notificacion.fechaInicioValidez = new Date(UtilFecha.toISO(datos["fiv"]));
      notificacion.fechaFinValidez = new Date(UtilFecha.toISO(datos["fiv"]));
      notificacion.ultimaActualizacion = new Date();

      //this.notificacionesSqLite.add(notificacion);

      alert(datos["titulo"] + ': ' + datos["texto"]);
    });

  }
  */

  accionesPrimerArranque() {
    try {
      // Se crean las bases de datos.
      var notifiSqlite = new NotificacionesSqLite(this.platform);
      notifiSqlite.crearBBDD().then(
        () => {
          console.log("Base de datos de NOTIFICACIONES creada correctamente.");
          var lectorNotificaciones = new LectorNotificaciones(this.http, notifiSqlite);
          lectorNotificaciones.cargarNotificacionesServidor();
        },
        (error) => {
          console.error("Error: Se ha producidoun error al crear la base de datos de notificaciones: " + error);
        }
      );

      var imagenesSqlite = new ImagenesSqLite(this.platform);
      imagenesSqlite.crearBBDD().then(() => {
        console.log("Base de datos de IMAGENES creada correctamente.");
        var sitiosSqlite = new SitiosSqLite(this.platform, imagenesSqlite, this.http);
        sitiosSqlite.crearBBDD().then(
          (b) => {
            //this.showAlert("sitioToBD", "Base de datos creada");
            console.log("Base de datos de SITIOS creada correctamente.");
            var lectorSitios = new LectorSitios(this.http, sitiosSqlite, imagenesSqlite);
            lectorSitios.cargarSitios();
            //this.showAlert("BIEN", "Se ha creado la base de datos: " + b);
          },
          (m) => { console.log("[accionesPrimerArranque] NO Se ha creado la base de datos: " + m); }
        );
      }, (error) => {
        console.log("[accionesPrimerArranque] NO Se ha creado la base de datos: " + error);
      });

      this.storage.set(MyApp.PRIMER_ARRANQUE, "false");
    } catch (e) {
      console.log("Excepcion capturada.");
    }

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
