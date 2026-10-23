import type { Request, Response } from "express";
import { changeMusica, musicaData } from "../data/musica.data.js";
import type { Formato } from "../model/formato.model.js";
import type { TipoSonido } from "../model/tipoSonido.model.js";
import type { Musica } from "../model/musica.model.js";
import type { TipoMusica } from "../model/tipoMusica.model.js";
import { changeColeccion, coleccionData } from "../data/coleccion.data.js";


//#region  GETS
//get general
export const getMusica = (req: Request, res: Response) => {
    res.json(musicaData);
};

//get by id
export const getMusicaById = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const musica = findMusica(id, res);

    if (!musica) return;

    res.json(musica);
};
//#endregion

//#region POST
export const postMusica = (req: Request, res: Response) => {
    if (!validarMusica(req.body, res)) return; // si los datos no son validos

    const { formato, nombre, duracion, caras, sonido, tipo } = req.body;

    const nuevaMusica: Musica = {
        id: Math.random(),
        caras,
        duracion,
        formato,
        nombre,
        sonido,
        tipo,
    };

    musicaData.push(nuevaMusica);

    res.status(201).json({
        message: "Musica creada correctamente",
        musica: nuevaMusica,
    });
};
//#endregion

//#region DELETE
export const deleteMusica = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const musica = findMusica(id, res);
    if (!musica) return;

    const nuevaLista = musicaData.filter((x) => x.id !== id);

    changeMusica(nuevaLista);

    //quitamos la musica de las colecciones que la tengan
    const nuevasColecciones = coleccionData.map((coleccion) => ({
        ...coleccion, //deja el resto de atributos como estaban
        musicaIds: coleccion.musicaIds.filter((x) => x !== id),
    }));

    changeColeccion(nuevasColecciones);

    res.json({
        message: "Musica eliminada correctamente",
    });
};
//#endregion

//#region PUT
export const putMusica = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const musica = findMusica(id, res);
    if (!musica) return;

    const { formato, nombre, duracion, caras, sonido, tipo } = req.body;

    const musicaActualizada: Musica = {
        ...musica, //para el id
        formato: formato != null ? formato : musica.formato,
        nombre: nombre != null ? nombre : musica.nombre,
        duracion: duracion != null ? duracion : musica.duracion,
        caras: caras != null ? caras : musica.caras,
        sonido: sonido != null ? sonido : musica.sonido,
        tipo: tipo != null ? tipo : musica.tipo,
    };

    // Validar los datos actualizados
    if (!validarMusica(musicaActualizada, res)) return;

    const nuevaLista = musicaData.map((x) =>
        x.id === id ? musicaActualizada : x,
    );
    changeMusica(nuevaLista);

    res.json({
        message: "Musica actualizada correctamente",
        musica: musicaActualizada,
    });
};
//#endregion

//#region FUNC. AUX
const findMusica = (id: number, res: Response) => {
    const musicaEncontrada = musicaData.find((x) => x.id == id);
    if (!musicaEncontrada) {
        res.status(404).json({
            message: `Musica con id: ${id} no encontrada`,
        });
        return;
    }
    return musicaEncontrada;
};

const validarMusica = (datos: Musica, res: Response): boolean => {
    const { formato, nombre, duracion, caras, sonido, tipo } = datos;

    if (
        !formatosValidos.find((x) => x === formato) ||
        !nombre ||
        Number(duracion) !== duracion || //verificar que sea numero y no string
        duracion <= 0 ||
        Number(caras) !== caras || //verificar que sea numero y no string
        caras <= 0 ||
        !sonidosValidos.find((x) => x === sonido) ||
        !tiposValidos.find((x) => x === tipo)
    ) {
        res.status(400).json({
            message: "Datos de la musica incorrectos o en formato incorrecto",
        });
        return false;
    }

    return true;
};
//#endregion

//#region DATOS VALIDOS
const formatosValidos: Formato[] = [
    "vinilo",
    "cassette",
    "CD",
    "DVD-Video",
    "DVD-Audio",
    "SACD",
    "Blu-ray",
];
const sonidosValidos: TipoSonido[] = ["mono", "estereo", "cuadrafonico"];
const tiposValidos: TipoMusica[] = ["analogica", "digital"];
//#endregion