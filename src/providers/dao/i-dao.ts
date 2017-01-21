export interface IDao<T> {
  tableName(): string;
  createTable(): string;
  allColumns(): string;
  addQuery(): string;
  getAllQuery(): string;

  fromBD(fila: any): T;
  toBD(T): Array<any>;
  toBdAdd(T): Array<any>;
}
