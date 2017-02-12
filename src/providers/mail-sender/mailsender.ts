import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';

import { MailContentDto } from './mailcontent-dto';

import { Config } from '../../config/config';

@Injectable()
export class MailSender {

  constructor(private http: Http) {
  }

  enviarMail(contenido: MailContentDto) {
    var contenidoMsj = this.crearMensaje(contenido);
    console.log("[MailSender] Se envia un correo a: " + Config.URL_ENVIO_CORREO);
    //console.log("[MailSender] Se envia un correo con el siguiente contenido: " +
    //  contenidoMsj);

    let headers = new Headers({ 'Content-Type': 'text/xml' });
    let options = new RequestOptions({
      headers: headers,
    });
    this.http.post(Config.URL_ENVIO_CORREO, contenidoMsj, options)
            .subscribe(
              (resultado) => console.log("1 Parece que se ha enviado correctamente: " + resultado),
              (error) => console.log("Se ha producido un error en el envio: " + error)
            );


            /*
    let options2 = new RequestOptions({
      headers: headers,
      url: Config.URL_ENVIO_CORREO,
      body: contenidoMsj,
      method: RequestMethod.Post
    });
    this.http.request(new Request(options2)).map(
            result => {
              console.log("2 El resultado es: " + result);
              //let data = result.json();
              //return data;
            }
        );
        */
  }

  private getValor(tag: string, valor: string): string {
    var resul = "";
    if(valor != null && valor != "") {
      resul = "<" + tag + ">" + valor + "</" + tag + ">";
    }
    return resul;
  }

  private crearMensaje(contenido: MailContentDto): string {
      /*
      <?xml version=\'1.0\'?>
      <contenidoIncidencia>
        <telefono></telefono>
        <correo></correo>
        <direccion></direccion>
        <tipo></tipo>
        <comentario></comentario>
        <imagen>
          <nombreImagen>
          </nombreImagen>
          <contenidoImagen>
          </contenidoImagen>
        </imagen>
      </contenidoIncidencia>
      */


    var resul = "<?xml version=\'1.0\'?><contenidoIncidencia>";
    resul += this.getValor("telefono", contenido.telefono);
    resul += this.getValor("correo", contenido.correo);
    resul += this.getValor("direccion", contenido.direccion);
    resul += this.getValor("tipo", contenido.tipo);
    resul += this.getValor("comentario", contenido.comentario);

    for(var i=0; i<contenido.imagenes.length; i++) {
      var imagen = contenido.imagenes[i];
      resul += "<imagen>";
      resul += this.getValor("nombreImagen", imagen.nombre);
      var imagenSinPrevio = this.imagenSinPrevio(imagen.imagen);
      resul += this.getValor("contenidoImagen", imagenSinPrevio);
      resul += "</imagen>";
    }

    resul += "</contenidoIncidencia>";

    return resul;
  }

  private imagenSinPrevio(imagen: string): string {
    var resul = imagen;
    if(imagen.startsWith(Config.DATA_IMAGE_JPG_BASE64)) {
      resul = imagen.substring(Config.DATA_IMAGE_JPG_BASE64.length);
    }

    return resul;
  }
}
