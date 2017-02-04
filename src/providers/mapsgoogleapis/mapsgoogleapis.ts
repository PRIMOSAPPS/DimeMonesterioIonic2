import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapsGoogleApis {

  private static get URL_CONSULTA() {return "https://maps.googleapis.com/maps/api/geocode/json?latlng=";}

  constructor(private http: Http) {
  }

  consultarDireccion(posicion): Observable<any> {
    var url = MapsGoogleApis.URL_CONSULTA + posicion.coords.latitude + ", " + posicion.coords.longitude;
    console.log("Se calculara la posicion a: " + url);

    return this.http.get(url).map(res => res.json());
  }
}
