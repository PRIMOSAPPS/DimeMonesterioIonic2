import { Component, Input } from '@angular/core';


/*
  Generated class for the Slider component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'mi-slider',
  templateUrl: 'slider.html',
  //directives: [IONIC_DIRECTIVES]
})
export class MiSlider {
  /*
  myOptions = {
    //effect: 'fade',
    autoplay: 500,
    autoplayDisableOnInteraction: false,
    loop: true,
    speed: 500,
    //pager: true
  };
  */
  @Input()
  sliderOptions: Object;

  @Input()
  clase: string;

  @Input()
  imagenes: Array<string>

  constructor() {
  }
}
