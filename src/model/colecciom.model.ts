import type { Musica } from "./musica.model.js";

export type Coleccion = {
    id: number;
    nombreColeccionista: string;
    musicaIds: number[];
};

export type ColeccionRespuesta = {
    id: number;
    nombreColeccionista: string;
    musica: Musica[];
    digital: Musica[];
    analogica: Musica[];
};
