export class Notificacion {
  id : number;
  idCategoria : number;
  titulo : string;
  texto : string;
  fechaInicioValidez : Date;
  fechaFinValidez : Date;
  ultimaActualizacion: Date;

  constructor() {
  }
}
