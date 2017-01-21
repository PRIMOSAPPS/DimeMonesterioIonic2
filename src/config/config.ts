import { Http } from '@angular/http';

//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';

export class Config {

  private static conf: any;

  private static urlNotificacionesDescarghables: string;
  private static urlNotificaciones: string;

  private constructor() {}

  public static init(http: Http): Observable<any> {
    var fich = "config/config.json";
    return http.get(fich).map(res => {
      Config.conf = res.json();

      Config.urlNotificacionesDescarghables = Config.SERVIDOR + Config.conf.rutaNotificacionesActualizablesApp;
      Config.urlNotificaciones = Config.SERVIDOR + Config.conf.rutaNotificacionesApp;

      console.log("[Config] Cargada la configuracion.");
    });

  }

  public static get TABLE_NAME(): string { return 'sitios'; }

  public static get URL_RADIO(): string {return Config.conf.urlRadio};

  public static get SERVIDOR(): string {return Config.conf.servidor};

  public static get URL_NOTIFICACIOPNES_DESCARGABLES(): string {return Config.urlNotificacionesDescarghables};

  public static get URL_NOTIFICACION(): string {return Config.urlNotificaciones};

  public static get IMAGENES_SLIDER(): Array<string> {return ["img/slide001.jpg", "img/slide002.jpg", "img/slide003.jpg",
    "img/slide004.jpg", "img/slide005.jpg", "img/slide006.jpg", "img/slide007.jpg"]};

}
