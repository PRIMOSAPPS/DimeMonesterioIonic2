import { Imagen } from '../imagen/imagen';

export class Sitio {
  id: number;
  idCategoria: number;
  nombre : string;
  textoCorto1 : string;
  textoCorto2 : string;
  textoCorto3 : string;
  textoLargo1 : string;
  textoLargo2 : string;
  latitud: number;
  longitud: number;
  direccion: string;
  poblacion: string;
  telefonosFijos: string;
  telefonosMoviles: string;
  web : string;
  email : string;
  facebook : string;
  twitter: string;
  ranking: number;
  favorito: boolean;
  activo: boolean;
  ultimaActualizacion: Date;

  logotipo: Imagen;
  imagenes: Array<Imagen>;





/*
  nombreLogotipo : string;
  nombreImagen1 : string;
  nombreImagen2 : string;
  nombreImagen3 : string;
  nombreImagen4 : string;

  imagenes: Array<string>;

  imagen1 : string;
  imagen2 : string;
  imagen3 : string;
  imagen4 : string;
  */

  constructor() {
    this.imagenes = new Array();
  }
}
