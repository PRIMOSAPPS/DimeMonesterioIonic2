import { ImagenMailDto } from './imagenmail-dto';

export class MailContentDto {
  telefono: string;
  correo: string;
  direccion: string;
  tipo: string;
  comentario: string;
  imagenes: Array<ImagenMailDto>;
}
