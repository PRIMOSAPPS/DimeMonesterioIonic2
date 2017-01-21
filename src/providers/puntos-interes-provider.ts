import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import {ItemListInterface, ItemList} from '../../providers/item-list-interface/item-list-interface'


/*
  Generated class for the PuntosInteresProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PuntosInteresProvider {

  puntoInteres: Array<Object>;

  constructor(private http: Http) {
    this.cargarSitios();
  }

  cargarSitios() {
    for (var i = 0; i < 10; i++) {
      this.cargarSitio(i);
    }
  }

  cargarSitio(i: number) {
    var fich = "sitios/sitios_json_${i}.json";
    this.http.get(fich)
      .subscribe(data => {
        var datos = data.json();
        //var item = new ItemList(datos.nombre, datos.logotipo);
        var item = {"texto": datos.nombre, "iconoBase64": datos.logotipo};
        this.puntoInteres.push(item);

        console.log("Cargado correctamente el sitio: " + item.texto);
      }, error => {
        console.log("Error cargando el sitio ${i}");
      });
  }

}
