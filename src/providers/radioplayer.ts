export class RadioPlayer {
  stream: any;
  promise: any;
  incrementoVolumen: number;

  constructor(private url: string) {
    this.stream = new Audio(this.url);
    this.stream.volume = 0.5;
    this.incrementoVolumen = 0.05;
  };

  play(success, error) {
    this.stream.play();
    this.promise = new Promise((resolve, reject) => {
      this.stream.addEventListener('playing', () => {
        success();
        resolve(true);
      });

      this.stream.addEventListener('error', () => {
        error();
        //reject(false);
        resolve(false);
      });
    });

    return this.promise;
  };

  pause() {
    this.stream.pause();
  };

  setIncrementoVolumen(incremento: number) {
    this.incrementoVolumen = incremento;
  }

  masVolumen() {
    if(this.stream.volume < 1) {
      this.stream.volume += this.incrementoVolumen;
    }
  }

  menosVolumen() {
    if(this.stream.volume > 0) {
      this.stream.volume -= this.incrementoVolumen;
    }
  }

}
