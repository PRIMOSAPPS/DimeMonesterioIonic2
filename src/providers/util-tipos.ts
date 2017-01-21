export class UtilTipos {

  public static toBoolean(n: number): boolean {
    return (n == 0)? false : true;
  }

  public static toNumber(b: boolean): number {
    return b ? 1 : 0;
  }

}
