import type { Coleccion } from "../model/colecciom.model.js";


export let coleccionData: Coleccion[] = [];

export const changeColeccion = (coleccionIn: Coleccion[]) => {
    coleccionData = coleccionIn;
}