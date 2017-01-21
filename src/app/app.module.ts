import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { Cabecera } from '../components/cabecera/cabecera';
import { MiSlider } from '../components/slider/slider';

import { ColaboracionCiudadanaPage, DialogoSlider, DialogoSinDireccion, DialogoConfirmacion }
  from '../pages/colaboracion-ciudadana/colaboracion-ciudadana';

import { ListPuntosInteresPage } from '../pages/list-puntos-interes/list-puntos-interes';
import { DetalleSitioPage } from '../pages/detalle-sitio/detalle-sitio';
import { NotificacionesPage } from '../pages/notificaciones/notificaciones';
import { DetalleNotificacionPage } from '../pages/detalle-notificacion/detalle-notificacion';

import { PreferenciasPage } from '../pages/preferencias/preferencias';
import { RadioPage } from '../pages/radio/radio';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    Cabecera,
    MiSlider,
    PreferenciasPage,
    RadioPage,
    ColaboracionCiudadanaPage,
    DialogoSinDireccion,
    DialogoConfirmacion,
    DialogoSlider,
    ListPuntosInteresPage,
    DetalleSitioPage,
    NotificacionesPage,
    DetalleNotificacionPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    Cabecera,
    MiSlider,
    PreferenciasPage,
    RadioPage,
    ColaboracionCiudadanaPage,
    DialogoSinDireccion,
    DialogoConfirmacion,
    DialogoSlider,
    ListPuntosInteresPage,
    DetalleSitioPage,
    NotificacionesPage,
    DetalleNotificacionPage
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [Storage, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
