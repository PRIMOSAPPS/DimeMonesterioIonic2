import { Component } from '@angular/core';

/*
  Generated class for the CompBorrar component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'comp-borrar',
  templateUrl: 'comp-borrar.html'
})
export class CompBorrar {

  text: string;

  constructor() {
    console.log('Hello CompBorrar Component');
    this.text = 'Hello World';
  }

}
