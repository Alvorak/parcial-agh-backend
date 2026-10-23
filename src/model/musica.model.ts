import type { Formato } from "./formato.model.js";
import type { TipoMusica } from "./tipoMusica.model.js";
import type { TipoSonido } from "./tipoSonido.model.js";

export type Musica = {
  id: number;
  formato: Formato;
  nombre: string;
  duracion: number; //en minutos
  caras: number; //numero de caras
  sonido: TipoSonido;
  tipo: TipoMusica;
};