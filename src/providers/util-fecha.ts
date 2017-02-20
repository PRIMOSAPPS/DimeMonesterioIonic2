export class UtilFecha {

  private static get PATRON() {return /(\d?\d)-(\d?\d)-(\d{4})\s(\d{2}):(\d{2}):(\d{2})/g;}
  // "19-5-2016 22:32:24".replace(pattern, "$3-$2-$1T$4:$5:$6Z");
  // "19-5-2016 22:32:24".match(pattern);"};

  public static toISO(fecha: string): string {
    var particion1 = fecha.split(" ");
    var pariticionFecha = particion1[0].split("-");
    var pariticionHora = particion1[1].split(":");

    var anio = pariticionFecha[2];
    var mes = pariticionFecha[1];
    if(mes.length < 2) {
      mes = "0" + mes;
    }
    var dia = pariticionFecha[0];
    if(dia.length < 2) {
      dia = "0" + dia;
    }
    var hora = pariticionHora[0];
    var minuto = pariticionHora[1];
    var segundo = pariticionHora[2];
    return anio+"-"+mes+"-"+dia+"T"+hora+":"+minuto+":"+segundo+"Z";
    //return fecha.replace(UtilFecha.PATRON, "$3-$2-$1T$4:$5:$6Z");
  }
}
