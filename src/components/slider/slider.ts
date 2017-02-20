import { Component, Input, ViewChild } from '@angular/core';

import {Slides} from 'ionic-angular'


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
    //effect: 'fade', // slide, fade, cube, coverflow or flip
    autoplay: 500,
    autoplayDisableOnInteraction: false,
    loop: true,
    speed: 500,
    //pager: true
  };
  */
  @Input()
  sliderOptions: any;

  @ViewChild(Slides) slides: Slides;

  @Input()
  clase: string;

  @Input()
  imagenes: Array<string>

  constructor() {
  }

  ngAfterViewInit() {
      this.slides.autoplay = this.sliderOptions.autoplay;
      this.slides.autoplayDisableOnInteraction = this.sliderOptions.autoplayDisableOnInteraction;
      this.slides.loop = this.sliderOptions.loop;
      this.slides.speed = this.sliderOptions.speed;
      this.slides.effect = this.sliderOptions.effect;
      //this.slides.loop = true;
      //this.slides.loop = true;
   }
}
