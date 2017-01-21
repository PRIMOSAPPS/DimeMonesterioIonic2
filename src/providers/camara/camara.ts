import { Injectable } from '@angular/core';
import { Camera } from 'ionic-native';

import { MediaCapture, CaptureImageOptions, MediaFile, CaptureError } from 'ionic-native';

@Injectable()
export class Camara {

  opciones: any;

  constructor() {
    this.opciones = {
      encodingType: Camera.EncodingType.PNG, // PNG
      targetWidth: 800,
    };
  }

  sacarFoto(): Promise<MediaFile[] | CaptureError> {
    let options: CaptureImageOptions = { limit: 3 };
    return MediaCapture.captureImage(options);
    /*
      .then(
        (data: MediaFile[]) => console.log(data),
        (err: CaptureError) => console.error(err)
      );
    */
      /*
    Camera.getPicture(this.opciones).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
    */
  }

    sacarFotoCamera(): Promise<any> {
      return Camera.getPicture(this.opciones);
      /*
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
      });
      */
    }
}
