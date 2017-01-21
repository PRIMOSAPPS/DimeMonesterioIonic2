import { Http } from '@angular/http';

import { Imagen } from '../../dto/imagen/imagen';
import { Sitio } from '../../dto/sitio/sitio';
import { SitiosSqLite } from '../dao/sitios-sq-lite/sitios-sq-lite';
import { ImagenesSqLite } from '../dao/imagenes-sitio-sqlite/imagenes-sitio-sqlite';

import { Base64 } from '../base-64';
import { UtilFecha } from '../util-fecha';
import { UtilTipos } from '../util-tipos';

//@Injectable()
export class LectorSitios {

  constructor(private http: Http, private sitiosSqLite: SitiosSqLite,
    private imagenesSqLite: ImagenesSqLite) {
  }

  cargarSitios() {
    this.cargarSitio(1).then(() => {
      this.cargarSitio(2).then(() => {
        this.cargarSitio(3).then(() => {
          this.cargarSitio(4).then(() => {
            this.cargarSitio(5).then(() => {
              this.cargarSitio(6).then(() => {
                this.cargarSitio(7).then(() => {
                  this.cargarSitio(8).then(() => {
                    this.cargarSitio(9).then(() => {});
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  private cargarSitio(i: number): Promise<any> {
    var fich = "sitios/sitios_json_${i}.json";
    fich = "sitios/sitios_json_" + i + ".json";
    var resul = new Promise((resolve, reject) => {
      this.http.get(fich).map(res => res.json()).subscribe(
        data => {
          var objSitio = this.leerSitio(data);
          this.sitioToBD(objSitio).then(
            () => {
              this.imagenesToBD(objSitio.imagenes, 0).then(() => {
                resolve(true);
              });
            }, (error) => {
              resolve(false);}
          );
        }
      );
    });
    return resul;
  }

  private sitioToBD(sitio: Sitio): Promise<any> {
    return this.sitiosSqLite.add(sitio);
  }

  private imagenesToBD(imagenes: Array<Imagen>, indice: number): Promise<any> {
    var promesa = new Promise((resolve, reject) => {
      if(indice < imagenes.length) {
        this.imagenesToBD(imagenes, indice+1).then(() => {
          this.imagenToBD(imagenes[indice]).then(
            () => {resolve(true);},
            (error) => {resolve(false);}
          );
        });
      } else {
        resolve(true);
      }
    });
    return promesa;
  }

  private imagenToBD(imagen: Imagen): Promise<any> {
    return this.imagenesSqLite.add(imagen);
  }

  private leerSitio(sitio): Sitio {
    var resul = new Sitio();
    resul.id = sitio.idSitio;
    resul.idCategoria = sitio.idCategoria;
    resul.nombre = Base64.decode(sitio.nombre);
    resul.textoCorto1 = Base64.decode(sitio.textoCorto1);
    resul.textoCorto2 = Base64.decode(sitio.textoCorto2);
    resul.textoCorto3 = Base64.decode(sitio.textoCorto3);
    resul.textoLargo1 = Base64.decode(sitio.textoLargo1);
    resul.textoLargo2 = Base64.decode(sitio.textoLargo2);
    resul.latitud = sitio.latitud;
    resul.longitud = sitio.longitud;
    resul.direccion = Base64.decode(sitio.direccion);
    resul.poblacion = Base64.decode(sitio.poblacion);
    resul.telefonosFijos = Base64.decode(sitio.telefonosFijos);
    resul.telefonosMoviles = Base64.decode(sitio.telefonosMoviles);
    resul.web = Base64.decode(sitio.web);
    resul.email = Base64.decode(sitio.email);
    resul.facebook = Base64.decode(sitio.facebook);
    resul.twitter = Base64.decode(sitio.twitter);
    resul.ranking = sitio.ranking;
    resul.favorito = false;
    resul.activo = UtilTipos.toBoolean(sitio.activo);
    if(sitio.ultima_actualizacion != null) {
      resul.ultimaActualizacion = new Date(UtilFecha.toISO(sitio.ultima_actualizacion));
    } else {
      resul.ultimaActualizacion = new Date(0);
    }
    resul.imagenes = new Array();

    if (sitio.logotipo != null && sitio.logotipo != "") {
      resul.logotipo = this.crearImagen(resul.id, sitio.nombreLogotipo, true, sitio.logotipo);
      //sitio.imagenes.push("data:image/jpeg;base64," + sitio.imagen1);
    }
    if (sitio.imagen1 != null && sitio.imagen1 != "") {
      resul.imagenes.push(this.crearImagen(resul.id, sitio.nombreImagen1, false, sitio.imagen1));
      //sitio.imagenes.push("data:image/jpeg;base64," + sitio.imagen1);
    }
    if (sitio.imagen2 != null && sitio.imagen2 != "") {
      resul.imagenes.push(this.crearImagen(resul.id, sitio.nombreImagen2, false, sitio.imagen2));
      //sitio.imagenes.push("data:image/jpeg;base64," + sitio.imagen2);
    }
    if (sitio.imagen3 != null && sitio.imagen3 != "") {
      resul.imagenes.push(this.crearImagen(resul.id, sitio.nombreImagen3, false, sitio.imagen3));
      //sitio.imagenes.push("data:image/jpeg;base64," + sitio.imagen3);
    }
    if (sitio.imagen4 != null && sitio.imagen4 != "") {
      resul.imagenes.push(this.crearImagen(resul.id, sitio.nombreImagen4, false, sitio.imagen4));
      //sitio.imagenes.push("data:image/jpeg;base64," + sitio.imagen4);
    }


    return resul;
  }

  private crearImagen(idSitio: number, nombre: string, isLogo: boolean, imagen: string): Imagen {
    var resul = new Imagen();
    resul.idSitio = idSitio;
    resul.nombre = nombre;
    resul.isLogo = isLogo;
    resul.imagen = imagen;

    return resul;
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

/*
  private handleError(error: Response | any) {
    console.log("[LectorNotificaciones] ERROR");
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  */
}
