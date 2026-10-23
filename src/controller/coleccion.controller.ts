import type { Request, Response } from "express";
import { changeColeccion, coleccionData } from "../data/coleccion.data.js";
import type { Coleccion, ColeccionRespuesta } from "../model/colecciom.model.js";
import type { Musica } from "../model/musica.model.js";
import { musicaData } from "../data/musica.data.js";


//#region  GETS
//get general
export const getColecciones = (req: Request, res: Response) => {
    const colecciones = coleccionData.map((nudillosGarcia) =>
        toColeccionResponse(nudillosGarcia),
    );
    res.json(colecciones);
};

export const getColeccionById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const coleccion = findColeccion(id, res);

    if (!coleccion) {
        return;
    }

    res.json(toColeccionResponse(coleccion));
};
//#endregion


//#region POST
export const postColeccion = (req: Request, res: Response) => {
    const { nombreColeccionista } = req.body; //olo nombre 

    if (!nombreColeccionista) {
        res.status(400).json({
            message: "El nombre del coleccionista es necesario.",
        });
        return;
    }

    const nuevaColeccion: Coleccion = {
        id: Math.random(),
        nombreColeccionista,
        musicaIds: [],
    };

    coleccionData.push(nuevaColeccion);

    res.status(201).json({
        message: "Colección creada correctamente",
        coleccion: toColeccionResponse(nuevaColeccion),
    });
};

export const addMusicToColeccion = (req: Request, res: Response) => {
    const coleccionId = Number(req.params.id);
    const coleccion = findColeccion(coleccionId, res);
    if (!coleccion) {
        return;
    }
    const { musicaId } = req.body;
    if (!musicaId) {
        res.status(400).json({
            message: "Se necesita una musica para añadri.",
        });
        return;
    }
    //el find musica  
    const musica = musicaData.find((x) => x.id === musicaId);
    if (!musica) {
        res.status(404).json({
            message: `Music con id: ${musicaId} no encontrada`,
        });
        return;
    }
    //miramos que la musica no este ya dentro
    if (coleccion.musicaIds.find((x) => x === musicaId) !== undefined) {
        res.status(400).json({
            message: "Musica ya incluida en la coleccion",
        });
        return;
    }
    const coleccionActualizada: Coleccion = {
        ...coleccion, //solo editamos musica
        musicaIds: [...coleccion.musicaIds, musicaId], //añadir id y dejar lo demas como estaba
    };
    changeColeccion(
        coleccionData.map((x) => (x.id === coleccionId ? coleccionActualizada : x)),
    );
    res.json({
        message: "Musica agregada a la colección correctamente",
        coleccion: toColeccionResponse(coleccionActualizada),
    });
};

//#endregion


//#region  PATCH
export const patchColeccion = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const coleccion = findColeccion(id, res);
    if (!coleccion) {
        return;
    }
    const { nombreColeccionista } = req.body;

    if (!nombreColeccionista || !nombreColeccionista.trim()) {
        res.status(400).json({
            message: "El nombre del coleccionista es necesario.",
        });
        return;
    }
    const coleccionActualizada: Coleccion = {
        ...coleccion, //pal id
        nombreColeccionista: nombreColeccionista,
    };
    changeColeccion(
        coleccionData.map((x) => (x.id === id ? coleccionActualizada : x)),
    );
    res.json({
        message: "Coleccion actualizada correctamente",
        coleccion: toColeccionResponse(coleccionActualizada),
    });
};
//#endregion

//#region DELETE
export const deleteColeccion = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const coleccion = findColeccion(id, res);
    if (!coleccion) {
        return;
    }
    changeColeccion(coleccionData.filter((x) => x.id !== id));
    return res.json({
        message: "Coleccion eliminada correctamente",
    });
};

export const quitarMusicFromColeccion = (req: Request, res: Response) => {
    const coleccionId = Number(req.params.id);
    const coleccion = findColeccion(coleccionId, res);
    if (!coleccion) {
        return;
    }

    const musicaId = Number(req.params.musicaId);
    if (!musicaId) {
        res.status(400).json({
            message: "El id de la musica es necesario.",
        });
        return;
    }
    const coleccionActualizada: Coleccion = { //como antes
        ...coleccion,
        musicaIds: coleccion.musicaIds.filter((id) => id !== musicaId),
    };
    changeColeccion(
        coleccionData.map((x) => (x.id === coleccionId ? coleccionActualizada : x)),
    );
    res.json({
        message: "Music eliminada de la colección correctamente",
        coleccion: toColeccionResponse(coleccionActualizada),
    });
};

//#endregion


//#region FUNCIONES AUX
// Función AUX de CollectionT => CollectionResponse
const toColeccionResponse = (coleccion: Coleccion): ColeccionRespuesta => {
    const getMusica = (ids: number[]): Musica[] =>
        ids.map((id) => musicaData.find((musica) => musica.id === id)!);

    return {
        id: coleccion.id,
        nombreColeccionista: coleccion.nombreColeccionista,
        analogica: getMusica(coleccion.musicaIds).filter(
            (x) => x.tipo === "analogica",
        ),
        digital: getMusica(coleccion.musicaIds).filter(
            (x) => x.tipo === "digital"),
        musica: getMusica(coleccion.musicaIds),
    };
};

//para buscar una coleccion por id
const findColeccion = (id: number, res: Response) => {
    const coleccionEncontrada = coleccionData.find((x) => x.id === id);
    if (!coleccionEncontrada) {
        res.status(404).json({
            message: `Musica con id: ${id} no encontrada`,
        });
        return;
    }
    return coleccionEncontrada;
};
//#endregion