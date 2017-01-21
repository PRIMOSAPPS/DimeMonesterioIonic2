export class UtilFecha {

  private static get PATRON() {return /(\d?\d)-(\d?\d)-(\d{4})\s(\d{2}):(\d{2}):(\d{2})/g;}
  // "19-5-2016 22:32:24".replace(pattern, "$3-$2-$1T$4:$5:$6Z");
  // "19-5-2016 22:32:24".match(pattern);"};

  public static toISO(fecha: string): string {
    return fecha.replace(UtilFecha.PATRON, "$3-$2-$1T$4:$5:$6Z");
  }
}
