import { Geolocation } from 'ionic-native';

//import { Observable } from 'rxjs/Observable';

export interface GpsListener {
  nuevaPosicion(posicion);
  getId(): number;
  setId(id: number);
}

export class Gps {

  subscripcion: any;
  listeners: Array<GpsListener>;
  idsListeners: number;

  constructor() {
    this.listeners = new Array();
    this.idsListeners = 0;
    /*
    this.subscripcion = Geolocation.watchPosition();
    this.subscripcion.subscribe((data) => {
      console.log("[Gps] Posicion recibida.");
      this.posicionRecibida(data);
    });
    */
    this.subscripcion = Geolocation.watchPosition();
    this.registrarPosicion();
  };

  /**
  Posicion del tipo Geoposition: coords y timestamp
  Ver http://ionicframework.com/docs/v2/native/geolocation/
  */
  private posicionRecibida(posicion) {
    console.log("[Gps] Calculada posicion: " + posicion.coords.latitude + ", " + posicion.coords.longitude);
    for(var i=0; i<this.listeners.length; i++) {
      this.listeners[i].nuevaPosicion(posicion);
    }
  }

  registrarPosicion() {
    console.log("[Gps] Se empieza e registro de la posicion.");
    this.subscripcion
      //.filter((p) => p.code === undefined)
      .subscribe((data) => {
        console.log("[Gps] Posicion recibida.");
        this.posicionRecibida(data);
    });
  }

  detenerRegistro() {
    this.subscripcion.unsubscribe();
  }

  addListener(listener: GpsListener) {
    listener.setId(this.idsListeners++);
    this.listeners[listener.getId()] = listener;
    console.log("[Gps] Nuevo listener con id: " + listener.getId());
  }

  removeListener(listener: GpsListener) {
    for(var i=0; i<this.listeners.length; i++) {
      if(listener.getId() === this.listeners[i].getId()) {
        this.listeners.splice(i, 1);
        break;
      }
    }
  }

}
