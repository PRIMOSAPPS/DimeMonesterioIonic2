import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { MailContentDto } from './mailcontent-dto';

@Injectable()
export class MailSender {

  constructor(private http: Http) {
  }

  enviarMail(contenido: MailContentDto) {
    var contenidoMsj = this.crearMensaje(contenido);
    console.log("[MailSender] Se envia un correo con el siguiente contenido: " +
      contenidoMsj);
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
      resul += this.getValor("contenidoImagen", imagen.imagen);
      resul += "</imagen>";
    }

    resul += "<contenidoIncidencia>";

    /*
    dataTagIniNombreImagen = "<nombreImagen>".toCharArray();
    char[] dataTagFinNombreImagen = "</nombreImagen>".toCharArray();
    char[] dataTagIniImagen = "<imagen>".toCharArray();
    char[] dataTagFinImagen = "</imagen>".toCharArray();
    char[] dataTagIniContenidoImagen = "<contenidoImagen>".toCharArray();
    char[] dataTagFinContenidoImagen = "</contenidoImagen>".toCharArray();
    char[] dataFin = "</contenidoIncidencia>".toCharArray();
    Iterator respCode = this.lstUrisFotos.iterator();

    while(respCode.hasNext()) {
        Uri respMess = (Uri)respCode.next();
        osw.write(dataTagIniImagen);
        osw.write(dataTagIniNombreImagen);
        osw.write(respMess.getLastPathSegment().toCharArray());
        osw.write(dataTagFinNombreImagen);
        osw.write(dataTagIniContenidoImagen);
        osw.write(this.getCharArray(respMess));
        osw.write(dataTagFinContenidoImagen);
        osw.write(dataTagFinImagen);
    }
    */

    return resul;
  }
}
