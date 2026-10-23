import type { Musica } from "../model/musica.model.js";


export let musicaData: Musica[] = [];

export const changeMusica = (musicaIn: Musica[]) => {
    musicaData = musicaIn;
}